import React, {createContext, useContext, useEffect, useState, useRef} from 'react'
import PropTypes from 'prop-types'

import {isServer} from '@salesforce/retail-react-app/app/utils/utils'

import {STATUS} from '../../constants'

import {useLocation} from 'react-router-dom'
import isEqual from 'lodash/isEqual'
import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'

const BloomreachAnalyticsContext = createContext(null)

function logPageView(BrTrk, data) {
    const tracker = BrTrk.getTracker()
    tracker.updateBrData({
        ...data,
        orig_ref_url: window?.location,
        rand: Math.random()
    })
    tracker.logPageView()
}

function logEvent(BrTrk, eventLogData, accountId) {
    const {eventGroup, eventType, eventData} = eventLogData
    const tracker = BrTrk.getTracker()

    const logData = {
        ...eventData,
        acct_id: accountId
    }

    if (eventGroup === 'cart') {
        tracker.logEvent(eventGroup, eventType, logData)
    } else if (eventGroup === 'widget') {
        tracker.logEvent(eventGroup, eventType, logData, true)
    } else {
        tracker.logEvent(eventGroup, eventType, logData, {}, true)
    }
}

export const BloomreachAnalyticsProvider = ({children}) => {
    const [BrTrk, setBrTrk] = useState(undefined)
    const [status, setStatus] = useState(STATUS.INIT)
    const location = useLocation()
    const [brData, setBrData] = useState(null)
    const [eventData, setEventData] = useState(null)
    const eventQueue = useRef([])

    const {app: appConfig} = getConfig()

    const defaultData = {
        acct_id: parseInt(appConfig?.blm?.accountId),
        domain_key: appConfig?.blm?.userId,
        debug: appConfig?.blm?.debug,
        test_data: appConfig?.blm?.testData
    }

    const prevBrData = useRef(null)

    const loadScript = (brData) => {
        const brTrkScript = document.createElement('script')
        brTrkScript.type = 'text/javascript'
        brTrkScript.async = true
        brTrkScript.src = `/mobify/proxy/bloomreach-cdn/v1/br-trk-${defaultData.acct_id}.js`

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

    useEffect(() => {
        if (eventData && status === STATUS.LOADED) {
            logEvent(BrTrk, eventData, defaultData?.acct_id)
        }
    }, [eventData, status])

    const log = (data) => {
        if (isServer) return

        setEventData(data)
    }

    return (
        <BloomreachAnalyticsContext.Provider value={{brData, BrTrk, status, track, log}}>
            {children}
        </BloomreachAnalyticsContext.Provider>
    )
}

BloomreachAnalyticsProvider.propTypes = {
    children: PropTypes.node
}

export const useBloomreachAnalytics = () => useContext(BloomreachAnalyticsContext)
