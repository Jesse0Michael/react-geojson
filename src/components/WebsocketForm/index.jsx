import React from "react";
import { useForm } from 'react-hook-form';
import "./form.css";

export function WebsocketForm(props) {
    const { handleSubmit, register, errors } = useForm();
    const onSubmit = values => {
        props.callback(values);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form">
            <label >
                Websocket URL
                <input name="url" ref={register} className="url-input" />
            </label>
            {errors.url && errors.url.message}

            <input type="submit" value="Submit" className="button" />
        </form>
    );
}

export default WebsocketForm;
