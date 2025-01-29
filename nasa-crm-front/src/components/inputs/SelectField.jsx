import React from 'react'
import { useEffect } from "react"


function SelectField(props) {

    useEffect(() => {
        props.setChange((prevObject) => ({ ...prevObject, [props.field]: props.object?.[props.field] || props.default || '' }))
      },[]);


      return (

        <label className="form-control w-full mr-1">
            <span className="label label-text">{props.fieldName}</span>
            <select className="select select-sm select-bordered"
                id={props.field}
                value={props.object?.[props.field] || props.default || ''}
                onChange={(e) => props.setChange({ ...props.object, [props.field]: props.number ? parseFloat(e.target.value) : e.target.value })}>
                {/* Add an empty option */}
                <option value="">{props.placeholder || 'Select...'}</option>
                {/* Map through options */}
                {props.options.map(o => {
                    return <option key={o.value} value={o.value}>{o.label}</option>
                })}
            </select>
        </label>
    )
}

export default SelectField