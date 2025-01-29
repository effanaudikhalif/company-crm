import React, { useEffect, useState } from 'react'
import api from '../api/axios';
import Select from 'react-select'
import { useData } from '../provider/DataProvider';
import InputField from './inputs/InputField';
import { useNavigate } from 'react-router-dom';
import InputDateField from './inputs/InputDateField';
import SelectField from './inputs/SelectField';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';


function ModalTrain(props) {

    const [project, setProject] = useState({});
    const navigate = useNavigate();
    const [selectedTag, setSelectedTag] = useState(props.task.pivot_tag.map(tag => ({ label: tag.tag.name, value: tag.tag_id })));
    const { tag, stagesTrain: stages, consultants } = useData();
    const [ isOpen, setIsOpen ] = useState(false);
    const { train_id } = useParams();

    useEffect(() => {

        if (train_id == props.id && typeof train_id != 'undefined') {
            setIsOpen(true);
            getTask();
        }
    }, []);

    const getTask = async (e) => {
        await api.get('/trains/' + props.id)
            .then(function (response) {
                // handle success
                setProject(response.data)
                //console.log(response.data);
            })
            .catch(function (error) {
                // handle error
                toast.error(error.message);
                console.log(error);
            })
    }

    const deleteTrain = async (e) => {
        await api.delete('/trains/' + props.id)
            .then(function (response) {
                // handle success
                //document.getElementById("modal_task_train" + props.id).close()
                props.getData();
                setIsOpen(false)
                toast.success("App deleted");
                //console.log(response.data);
            })
            .catch(function (error) {
                // handle error
                toast.error(error.message);
                console.log(error);
            })
    }

    const launchTrain = async (e) => {
        let proj = project;
        project.step = 1;
        await api.post('/trains/' + props.id, {
            data: proj
        })
            .then(function (response) {
                // handle success
                toast.success("Train launched");
                //console.log(response.data);
            })
            .catch(function (error) {
                // handle error
                toast.error(error.message);
                console.log(error);
            })
    }

    const updateProject = async (e) => {
        let yes = 0

        let proj = project;
        delete proj.pivot_tag;
        delete proj.train_id;
        delete proj.stage;

        console.log(project)

        await api.post('/trains/' + props.id, {
            data: proj
        })
            .then(function (response) {
                // handle success
                yes = yes + 1;
                //console.log(response.data);
            })
            .catch(function (error) {
                // handle error
                toast.error(error.message);
                console.log(error);
            })

        await api.post('/tags/train/' + props.id, {
            tag: selectedTag.map(tag => tag.value)
        })
            .then(function (response) {
                // handle success
                yes = yes + 1;
                //console.log(response.data);
            })
            .catch(function (error) {
                // handle error
                toast.error(error.message);
                console.log(error);
            })

        if (yes == 2) {
            //close modal
            toast.success("Train updated");
            setIsOpen(false)
            props.getData();
        }
    };

    return (
        <div>

            <div onClick={() => {
                //document.getElementById('modal_task_train' + props.id).showModal();
                setIsOpen(true)
                getTask();
            }}>
                <div className="flex justify-between font-medium">
                    <div>{props.task.application_name}</div>
                    {
                        props.task.step == 1 ?
                            <span className="loading loading-ring loading-md h-6"></span> :
                            props.task.step == 2 ?
                                <span className="h-6">✕</span> :
                                props.task.step == 3 ?
                                    <button className='btn-ghost rounded-lg border ' onClick={launchTrain}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                                        </svg>
                                    </button> :
                                    <span className="h-6"></span>
                    }
                </div>
                <div className='block'>
                    {props.task.pivot_tag.map(p_tag => {
                        return <div key={p_tag.pivot_tag_id} className="badge mr-1" style={{ backgroundColor: p_tag.tag.color + '80', borderColor: p_tag.tag.color }} >{p_tag.tag.name}</div>
                    })}

                </div>
                <div className='text-sm'>
                    {props.task.comment}
                </div>

            </div>
            {isOpen &&
                <div open={isOpen} id={"modal_task_train" + props.id} className="modal modal-bottom sm:modal-middle">

                    <div className="modal-box">
                        <div className='flex justify-between items-center'>
                            <h3 className="font-bold text-lg m-2">Application scan (train_id : {props.task.train_id})</h3>

                            <div className="modal-action m-0">
                                <button onClick={(e) => setIsOpen(false)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </div>
                        </div>

                        <form>
                            <div className=''>

                                <InputField fieldName="Application name" field="application_name" object={project} setChange={setProject} />

                                <label className="form-control w-full">
                                    <div className="label">
                                        <span className="label-text">Type of report</span>
                                    </div>
                                    <Select
                                        isMulti
                                        closeMenuOnSelect={false}
                                        hideSelectedOptions={false}
                                        value={selectedTag}
                                        classNamePrefix="select"
                                        defaultValue={selectedTag}
                                        onChange={setSelectedTag}
                                        options={tag.filter(t => t.type == 'report').map(t => ({ ...t, label: t.name, value: t.tag_id }))}
                                        classNames={{
                                            multiValue: () => "rounded-lg ",
                                        }}
                                    >
                                    </Select>
                                </label>
                                {!project.portfolio ?
                                    <div>
                                        <InputField fieldName="Application display name" field="appDisplayName" object={project} setChange={setProject} />
                                        <InputField fieldName="Filename" field="Filename" object={project} setChange={setProject} />
                                        <InputField fieldName="Application code" field="application_code" object={project} setChange={setProject} />
                                    </div>
                                    : ""}
                                <InputDateField fieldName="Creation date" field="appCode" object={project} setChange={setProject} />

                                <SelectField fieldName="Consultant" field="consultant_id" options={consultants.map((cons) => ({
                                    label: cons.name,
                                    value: parseFloat(cons.consultant_id),
                                }))}
                                    object={project} setChange={setProject} number={true} />




                                <div className='flex w-full items-end'>
                                    <SelectField fieldName="Project" field="project_id" options={props.projectList.map((p) => ({
                                        label: p.client_name,
                                        value: parseFloat(p.project_id),
                                    }))}
                                        object={project} setChange={setProject} number={true} />

                                    <button className="btn btn-sm btn-circle btn-ghost ml-2" onClick={() => navigate('/project/' + project.project_id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M15.75 2.25H21a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V4.81L8.03 17.03a.75.75 0 0 1-1.06-1.06L19.19 3.75h-3.44a.75.75 0 0 1 0-1.5Zm-10.5 4.5a1.5 1.5 0 0 0-1.5 1.5v10.5a1.5 1.5 0 0 0 1.5 1.5h10.5a1.5 1.5 0 0 0 1.5-1.5V10.5a.75.75 0 0 1 1.5 0v8.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V8.25a3 3 0 0 1 3-3h8.25a.75.75 0 0 1 0 1.5H5.25Z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>

                                <SelectField fieldName="Stage" field="stage_id" options={stages.map((s) => ({
                                    label: s.name,
                                    value: parseFloat(s.stage_id),
                                }))}
                                    object={project} setChange={setProject} number={true} />
                            </div>

                            <div className="h-4" ></div>
                            <div className='flex justify-between'>
                                <button className="btn m-2" type="button" onClick={updateProject}>Update</button>
                                <button className="btn m-2 btn-outline btn-error " type="button" onClick={deleteTrain}>Delete</button>
                            </div>

                        </form>

                    </div>
                </div>
            }
        </div>
    )
}

export default ModalTrain