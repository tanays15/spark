import React from "react";

const ButtonPrimary = ({ children, className = "", ...props }) => {
    return (
        <button
            className={`px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default ButtonPrimary;