import React from 'react'
import { useEffect } from "react"


function InputFloatField(props) {

    useEffect(() => {
        props.setChange((prevObject) => ({ ...prevObject, [props.field]: props.object?.[props.field] || parseFloat(props.default) || 0 }))
      },[]);

    return (
        <label className="form-control w-full mr-1">
            <span className="label label-text">{props.fieldName}</span>
            <input type="text" placeholder="Type here" className="input input-sm input-bordered w-full"
                id={props.field}
                value={props.object?.[props.field] || ''}                
                onChange={(e) => props.setChange({ ...props.object, [props.field]: parseFloat(e.target.value) })}
            />
        </label>
    )
}

export default InputFloatField