import { useEffect } from "react"
import React from 'react'

function InputField(props) {

    useEffect(() => {
        props.setChange((prevObject) => ({ ...prevObject, [props.field]: props.object?.[props.field] || props.default || '' }))
      },[]);

      // for updated default = vm_url
      useEffect(() => {
        props.setChange((prevObject) => ({...prevObject, [props.field]: props.default }))
      },[props.default]);

    return (
        <label className="form-control w-full mr-1">
            <span className="label label-text">{props.fieldName}</span>
            <input type="text" placeholder="Type here" className="input input-sm input-bordered w-full"
                id={props.field}
                value={props.object?.[props.field] || props.default || ''} 
                onChange={(e) => props.setChange((prevObject) => ({...prevObject, [props.field]: e.target.value }))}
            />
        </label>
    )
}

export default InputField