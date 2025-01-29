import React from 'react'
import { format } from '../../utils/date'
import { useEffect } from "react"


function InputDateField(props) {

    useEffect(() => {
        props.setChange((prevObject) => ({ ...prevObject, [props.field]: props.object?.[props.field] || props.default || new Date().toISOString() }))
      },[]);
    
    return (
        <label className="form-control w-full mr-1">
            <span className="label label-text">{props.fieldName}</span>
            <input type="date" placeholder="Type here" className="input input-sm input-bordered w-full"
                id={props.field}
                //defaultValue={format(props.object?.[props.field])}
                value={format(props.object?.[props.field]) || format(new Date().toISOString())}
                onChange={(e) => props.setChange({ ...props.object, [props.field]: new Date(e.target.value).toISOString() })}
                disabled={props.disabled}
            />
        </label>
    )
}

export default InputDateField