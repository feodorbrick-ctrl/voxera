import {useEffect, useRef, useState} from "react";
import "./customSelect.css";

export default function CustomSelect({
                                         options = [], value,
                                         onChange,
                                         placeholder = "Select...",
                                         disabled = false
                                     }) {

    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                selectRef.current &&
                !selectRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    function handleOptionClick(option) {
        onChange(option);
        setIsOpen(false);
    }

    return (
        <div
            className={`customSelect ${disabled ? "disabled" : ""}`}
            ref={selectRef}
        >
            <button
                type="button"
                className="customSelect__button"
                onClick={() => {
                    if (!disabled) {
                        setIsOpen(prev => !prev);
                    }
                }}
                aria-expanded={isOpen}
                disabled={disabled}
            >
                <span>
                    {value || placeholder}
                </span>

                <span
                    className={`customSelect__arrow ${
                        isOpen ? "open" : ""
                    }`}
                >
                    📖
                </span>
            </button>

            {isOpen && (
                <div className="customSelect__dropdown">
                    {options.map((option, index) => (
                        <button
                            type="button"
                            className={`customSelect__option ${
                                option === value ? "selected" : ""
                            }`}
                            key={index}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}