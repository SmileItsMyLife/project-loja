import { useState } from "react";

/* eslint-disable react/prop-types */
export default function InputNumber({ value, onChangeString, properts }) {
    const defaultValue = value || "Error: No value provided";
    const [stringValue, setStringValue] = useState(defaultValue);

    const handlerChangeText = (e) => {
        const newValue = e.target.value;
        setStringValue(newValue);
        onChangeString(newValue);
    };

    const handleBlur = () => {
        if (stringValue === '') {
            setStringValue(defaultValue);
            onChangeString(defaultValue);
        }
    };

    return (
        <input
            type="number"
            {...properts}
            value={stringValue}
            onChange={handlerChangeText}
            onBlur={handleBlur}
        />
    );
}