import React from 'react';
import './spinner.css'

const Spinner = ({isSpinnerVisible = false}) => {
    return (
        <div>
            {isSpinnerVisible &&
                <div className="spinner"/>
            }
        </div>
    );
};

export default Spinner;