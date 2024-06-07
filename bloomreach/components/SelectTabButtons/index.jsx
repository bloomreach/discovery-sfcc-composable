import React from 'react'
import PropTypes from 'prop-types'
import {Button} from '@salesforce/retail-react-app/app/components/shared/ui'

const SelectTabButton = ({isActive, label, count, onClick}) => {
    const buttonText = [label]
    if (count) {
        buttonText.push(`(${count})`)
    }

    return (
        <Button
            w="100%"
            colorScheme={isActive ? 'blueAlpha' : 'gray'}
            bgColor={isActive ? 'blue.500' : 'gray.100'}
            size="lg"
            fontSize="16px"
            fontWeight={400}
            borderRadius={0}
            onClick={onClick}
        >
            {`${buttonText.join(' ')}`}
        </Button>
    )
}

SelectTabButton.propTypes = {
    label: PropTypes.string,
    count: PropTypes.number,
    isActive: PropTypes.bool,
    onClick: PropTypes.func
}

export default SelectTabButton
