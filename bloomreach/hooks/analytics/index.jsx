import React, {createContext, useContext, useEffect, useState, useRef} from 'react'
import PropTypes from 'prop-types'

import {isServer} from '@salesforce/retail-react-app/app/utils/utils'

import {ACCOUNT_ID, AUTH_KEY, DEBUG, TEST_DATA, scriptUrl, STATUS} from '../../constants'

import {useLocation} from 'react-router-dom'
import isEqual from 'lodash/isEqual'

const BloomreachAnalyticsContext = createContext(null)

const defaultData = {
    acct_id: parseInt(ACCOUNT_ID),
    domain_key: AUTH_KEY,
    debug: DEBUG,
    test_data: TEST_DATA
}

function logPageView(BrTrk, data) {
    const tracker = BrTrk.getTracker()
    tracker.updateBrData({
        ...data,
        orig_ref_url: window?.location,
        rand: Math.random()
    })
    tracker.logPageView()
}

export const BloomreachAnalyticsProvider = ({children}) => {
    const [BrTrk, setBrTrk] = useState(undefined)
    const [status, setStatus] = useState(STATUS.INIT)
    const location = useLocation()
    const [brData, setBrData] = useState(null)
    const eventQueue = useRef([])

    const prevBrData = useRef(null)

    const loadScript = (brData) => {
        const brTrkScript = document.createElement('script')
        brTrkScript.type = 'text/javascript'
        brTrkScript.async = true
        brTrkScript.src = scriptUrl

        brTrkScript.onload = () => {
            setBrTrk(window.BrTrk)
            setStatus(STATUS.LOADED)
        }

        brTrkScript.onerror = () => {
            setStatus(STATUS.ERROR)
        }

        window.br_data = brData
        prevBrData.current = brData

        const s = document.getElementsByTagName('script')[0]
        s.parentNode.insertBefore(brTrkScript, s)
    }

    useEffect(() => {
        setBrData((prevData) => {
            return {...prevData, ...defaultData}
        })
    }, [location.pathname])

    useEffect(() => {
        if (brData?.ptype) {
            if (status === STATUS.INIT) {
                setStatus(STATUS.LOADING)
                loadScript(brData)
            }
            if (status === STATUS.LOADING) {
                eventQueue.current.push(brData)
            }

            if (status === STATUS.LOADED) {
                if (eventQueue.current.length) {
                    while (eventQueue.current.length > 0) {
                        const entry = eventQueue.current.shift()
                        if (!isEqual(entry, prevBrData.current)) {
                            prevBrData.current = brData
                            logPageView(BrTrk, entry)
                        }
                    }
                } else if (!isEqual(brData, prevBrData.current)) {
                    prevBrData.current = brData
                    logPageView(BrTrk, brData)
                }
            }
        }
    }, [brData, status])

    const track = (data) => {
        if (isServer) return

        if (!data.ptype) return // Check if ptype is provided

        setBrData((prevState) => {
            if (prevState?.ptype !== data?.ptype) {
                return {...defaultData, ...data}
            }
            return {...prevState, ...data}
        })
    }

    return (
        <BloomreachAnalyticsContext.Provider value={{brData, BrTrk, status, track}}>
            {children}
        </BloomreachAnalyticsContext.Provider>
    )
}

BloomreachAnalyticsProvider.propTypes = {
    children: PropTypes.node
}

export const useBloomreachAnalytics = () => useContext(BloomreachAnalyticsContext)
