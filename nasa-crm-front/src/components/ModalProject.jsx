import React, { useState, useEffect } from 'react'
import api from '../api/axios';
import { useData } from '../provider/DataProvider';
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import InputField from './inputs/InputField'
import InputDateField from './inputs/InputDateField';
import InputFloatField from './inputs/InputFloatField';
import InputPasswordField from './inputs/InputPasswordField';
import SelectField from './inputs/SelectField';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import axios from "axios";


function ModalProject(props) {

    const [project, setProject] = useState({});
    const [configuration, setConfiguration] = useState({});
    const [selectedTech, setSelectedTech] = useState(props.addModal ? [] : props.task.pivot_project_tag.map(tag => ({ label: tag.tag.name, value: tag.tag_id })));
    const [selectedConsultant, setSelectedConsultant] = useState([]);
    const [portfolio, setPortfolio] = useState(false);
    const [appTrain, setAppTrain] = useState([]);
    const [appHighlight, setAppHighlight] = useState([]);
    const [trainAppName, setTrainAppName] = useState("");
    const { user } = useAuth();
    const { tag, consultants } = useData();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { project_id } = useParams();

    useEffect(() => {

        if (project_id == props.id && typeof project_id != 'undefined') {
            getTask()
            setIsOpen(true)      
          }
    }, []);

    const getTask = async (e) => {
        await api.get('/projects/' + props.id)
            .then(function (response) {
                // handle success
                setProject(response.data)
                setSelectedConsultant(response.data.pivot_project_consultant.map(cons => ({ label: cons.consultant.name, value: cons.consultant.consultant_id })))
                //console.log(response.data);
            })
            .catch(function (error) {
                // handle error
                toast.error(error.message);
                console.log(error);
            })

        await api.get('/configurations/' + props.id)
            .then(function (response) {
                // handle success
                setConfiguration(response.data)
                //console.log(response.data);
            })
            .catch(function (error) {
                // handle error
                toast.error(error.message);
                console.log(error);
            })

        await api.get('/trains/project/' + props.id)
            .then(function (response) {
                // handle success
                let appTrainTemp = []
                response.data.map(app => {
                    if (app.portfolio) {
                        setPortfolio(true)
                    }
                    appTrainTemp.push(app)
                })
                setAppTrain(appTrainTemp)
                //console.log(response.data);
            })
            .catch(function (error) {
                // handle error
                toast.error(error.message);
                console.log(error);
            })
    }

    const addProject = async (e) => {

        let proj = project;
        delete proj.client;

        await api.post('/projects', {
            data: {
                project: proj,
                tag: selectedTech.map(tag => tag.value),
                consultant: selectedConsultant.map(cons => cons.value),
                configuration: configuration
            }
        })
            .then(function (response) {
                // handle success
                //document.getElementById("modal_add_project").close()
                setIsOpen(false)
                props.getData();
                setProject({})
                setConfiguration({})
                toast.success("Project added");
                //console.log(response.data);
            })
            .catch(function (error) {
                // handle error
                toast.error(error.message);
                console.log(error);
            })
    };

    const updateProject = async (e) => {
        let yes = 0
        let proj = project;
        delete proj.pivot_project_tag;
        delete proj.pivot_project_consultant;
        delete proj.project_id;
        delete proj.client;

        await api.post('/projects/' + props.id,
            { data: proj })
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

        await api.post('/tags/project/' + props.id, {
            tag: selectedTech.map(tag => tag.value)
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

        await api.post('/consultants/project/' + props.id, {
            consultant_id: selectedConsultant.map(cons => cons.value)
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

        await api.post('/configurations/' + configuration.infraconfig_id,
            { data: configuration })
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

        if (yes == 4) {
            //close modal
            setIsOpen(false)
            toast.success("Project updated");
            //document.getElementById("modal_project" + props.id).close()
            props.getData();
        }
    };

    const deleteProject = async (e) => {

        await api.delete('projects/' + props.id)
            .then(function (response) {
                // handle success
                setIsOpen(false)
                //document.getElementById("modal_project" + props.id).close()
                props.getData();
                setProject({})
                toast.success("Project deleted");
                //console.log(response.data);
            })
            .catch(function (error) {
                // handle error
                toast.error(error.message);
                console.log(error);
            })
    };

    const createPortfolio = async (e) => {
        await api.post('/trains/configureportfolio/' + props.id,
            { data: project })
            .then(function (response) {
                // handle success
                //console.log(response.data);
                toast.success("Portfolio created");
                getTask()
                project.portfolio = true;
                setPortfolio(true);
            })
            .catch(function (error) {
                // handle error
                toast.error(error.message);
                console.log(error);
            })
    };

    const createAppTrain = async (e) => {
        const train = {
            application_name: e,
            project_id: project.project_id,
            consultant_id: project.consultant_id,
            infraconfig_id: project.infraconfig_id,
        }

        await api.post('/trains/',
            train)
            .then(function (response) {
                // handle success
                //console.log(response.data);
                setTrainAppName("")
                getTask()
                toast.success("App created");
            })
            .catch(function (error) {
                // handle error
                toast.error(error.message);
                console.log(error);
            })
    };
    // get clients
    const getClients = async (e) => {
        try {
            const response = await api.get('/clients/' + e);
            const clientsData = response.data.map(x => ({ label: x.name, value: x.client_id }));
            return clientsData;
        } catch (error) {
            console.error('Error fetching clients:', error);
            return [];
        }
    };

    // promise get clients
    const promiseOptions = (inputValue) =>
        new Promise((resolve) => {
            setTimeout(() => {
                resolve(getClients(inputValue));
            }, 1000);
        });

    return (
        <div>

            {props.addModal ?
                <div className="btn m-2" onClick={() => {
                    setIsOpen(true)
                }
                }
                >Add new project</div>
                :
                <div className="" onClick={() => {
                    setIsOpen(true)
                    getTask()
                }}>
                    <div className="flex justify-between font-medium">
                        <div>{props.task?.client_name}</div>
                        <span className="">{props.task?.project_id}</span>
                    </div>
                    <div className='block'>
                        {props.task?.pivot_project_tag.map(p_tag => {
                            return <div key={p_tag.pivot_project_tag_id} className="badge mr-1" style={{ backgroundColor: p_tag.tag.color + '80', borderColor: p_tag.tag.color }} >{p_tag.tag.name}</div>
                        })}

                    </div>
                    <div className='text-sm'>
                        {props.task?.comment}
                    </div>
                </div>
            }
            {isOpen &&

                <div open={isOpen} id={props.addModal ? "modal_add_project" : "modal_project" + props.id} className="modal">
                    <div className="modal-box w-11/12 max-w-5xl h-[80vh]">

                        <div className='flex justify-between items-center'>
                            <h3 className="font-bold text-lg">{props.addModal ? "Add" : "Update"} a project</h3>

                            <div className="modal-action m-0">
                                <button onClick={(e) => { setIsOpen(false); setProject({}); setConfiguration({}) }} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </div>
                        </div>

                        <div >
                            <div role="tablist" className="tabs tabs-bordered">
                                <input type="radio" name="my_main_tabs" role="tab" className="tab min-w-max pr-5" aria-label="General information" defaultChecked />
                                <div role="tabpanel" className="tab-content pt-5 min-h-[55vh]">
                                    <div className='flex'>
                                        <div className='w-1/2 m-2'>

                                            <h3 className="font-medium text-lg">General information</h3>

                                            <div className='flex w-full'>
                                                <InputField fieldName="Project name" field="client_name" object={project} setChange={setProject} />
                                                <label className="form-control w-full">
                                                    <span className="label label-text">Client</span>
                                                    <AsyncSelect cacheOptions defaultOptions loadOptions={promiseOptions}
                                                        onChange={(e) => setProject({ ...project, client_id: e.value, client: { client_id: e.value, name: e.label } })}
                                                        value={{ label: project.client?.name, value: project.client?.client_id }}
                                                        classNamePrefix="select" />
                                                </label>
                                            </div>

                                            <div className='flex w-full'>
                                                <SelectField fieldName="Consultant" field="consultant_id" options={consultants.map((cons) => ({
                                                    label: cons.name,
                                                    value: parseFloat(cons.consultant_id),
                                                }))}
                                                    object={project} setChange={setProject} number={true} default={consultants.find(x => x.email == user.email).consultant_id} />

                                                <div className='flex flex-col w-1/3'>
                                                    <label className="form-control flex-row ml-1 items-center justify-between">
                                                        <span className="label label-text">Highlight</span>
                                                        <input type="checkbox" className="checkbox"
                                                            id="highlight"
                                                            checked={project.highlight || ''}
                                                            onChange={(e) => setProject({ ...project, highlight: e.target.checked })}
                                                        />
                                                    </label>

                                                    <label className="form-control flex-row ml-1 items-center justify-between">
                                                        <span className="label label-text">Imaging</span>
                                                        <input type="checkbox" className="checkbox"
                                                            id="imaging"
                                                            checked={project.imaging || ''}
                                                            onChange={(e) => setProject({ ...project, imaging: e.target.checked })}
                                                        />
                                                    </label>
                                                </div>
                                            </div>

                                            <div className='flex w-full'>
                                                <InputDateField fieldName="Start date" field="start_date" object={project} setChange={setProject} />
                                                <InputDateField fieldName="Due date" field="due_date" object={project} setChange={setProject} />
                                            </div>

                                            <label className="form-control w-full">
                                                <span className="label label-text">Description</span>
                                                <textarea type="text" rows="4" placeholder="Type here" className="textarea textarea-sm textarea-bordered w-full"
                                                    id="description"
                                                    value={project.description || ''}
                                                    onChange={(e) => setProject({ ...project, description: e.target.value })}
                                                />
                                            </label>

                                            <label className="form-control w-full ml-1">
                                                <div className="label">
                                                    <span className="label-text">Attached consultants</span>
                                                </div>
                                                <Select
                                                    isMulti
                                                    closeMenuOnSelect={false}
                                                    hideSelectedOptions={false}
                                                    value={selectedConsultant}
                                                    classNamePrefix="select"
                                                    defaultValue={selectedConsultant}
                                                    onChange={setSelectedConsultant}
                                                    options={consultants.map(cons => ({ label: cons.name, value: cons.consultant_id }))}
                                                    classNames={{
                                                        multiValue: () => "rounded-lg ",
                                                    }}
                                                >
                                                </Select>
                                            </label>
                                        </div>
                                        <div className='w-1/2 m-2'>

                                            {/* EXECUTION */}
                                            <h3 className="font-medium text-lg">Execution</h3>

                                            <div className='flex w-full items-end'>
                                                <InputField fieldName="Teams channel" field="teams_channel" object={project} setChange={setProject} />
                                                <button className="btn btn-sm btn-circle btn-ghost" onClick={(e) => {
                                                    e.preventDefault()
                                                    window.open(project.teams_channel, '_blank')
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <SelectField fieldName="Infrastructure" field="infrastructure" options={[
                                                { value: 'CAST', label: 'CAST' },
                                                { value: 'RDC', label: 'RDC' },
                                                { value: 'WebEx', label: 'WebEx' },
                                                { value: 'No direct access', label: 'No direct access' },
                                            ]}
                                                object={project} setChange={setProject} />

                                            <div className="divider" />
                                            {/* QUALIFICATION */}
                                            <h3 className="font-medium text-lg">Qualification</h3>

                                            <div className='flex w-full items-end'>
                                                <InputField fieldName="Hubspot deal" field="hubspot_deal" object={project} setChange={setProject} />
                                                <button className="btn btn-sm btn-circle btn-ghost" onClick={(e) => {
                                                    e.preventDefault()
                                                    window.open(project.hubspot_deal, '_blank')
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className='flex w-full items-end'>
                                                <SelectField fieldName="Deal size" field="deal_size" options={[
                                                    { value: '<50$k', label: '<50$k' },
                                                    { value: '<100$k', label: '<100$k' },
                                                    { value: '<250$k', label: '<250$k' },
                                                    { value: '<500$K', label: '<500$K' },
                                                    { value: '>500$K', label: '>500$K' },
                                                ]} object={project} setChange={setProject} />

                                                <InputFloatField fieldName="Number of apps (project only)" field="app_number_poc" object={project} setChange={setProject} />
                                                <InputFloatField fieldName="Number of apps (follow-on deal)" field="app_number_goal" object={project} setChange={setProject} />

                                                <label className="form-control w-full ml-1">
                                                    <span className="label label-text">SoW</span>
                                                    <input type="checkbox" className="checkbox"
                                                        id="sow"
                                                        checked={project.sow || ''}
                                                        onChange={(e) => setProject({ ...project, sow: e.target.checked })}
                                                    />
                                                </label>
                                            </div>

                                            <div className='flex w-full items-end'>

                                                <SelectField fieldName="Funding" field="funding" options={[
                                                    { value: 'CAST', label: 'CAST' },
                                                    { value: 'Client', label: 'Client' },
                                                    { value: 'Partner', label: 'Partner' },
                                                ]} object={project} setChange={setProject} />


                                                <label className="form-control w-full ml-1">
                                                    <div className="label">
                                                        <span className="label-text">Expected technologies</span>
                                                    </div>
                                                    <Select
                                                        isMulti
                                                        closeMenuOnSelect={false}
                                                        hideSelectedOptions={false}
                                                        value={selectedTech}
                                                        classNamePrefix="select"
                                                        defaultValue={selectedTech}
                                                        onChange={setSelectedTech}
                                                        options={tag.filter(t => t.type == 'tech').map(t => ({ ...t, label: t.name, value: t.tag_id }))}
                                                        classNames={{
                                                            multiValue: () => "rounded-lg ",
                                                        }}
                                                    >
                                                    </Select>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <input type="radio" name="my_main_tabs" role="tab" className="tab min-w-max pl-5 pr-5" aria-label="Technical configuration" />
                                <div role="tabpanel" className="tab-content pt-5 min-h-[55vh]">
                                    <div className='flex'>
                                        <div className='w-1/2 m-2'>
                                            {/* CONFIG */}
                                            <h3 className="font-medium text-lg">Configuration</h3>
                                            <InputField fieldName="URL VM Imaging" field="vm_url" object={configuration} setChange={setConfiguration} default={configuration?.vm_url || ""} />

                                            <div role="tablist" className="tabs tabs-bordered">
                                                <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Highlight" defaultChecked />
                                                <div role="tabpanel" className="tab-content p-1">

                                                    <SelectField fieldName="highlighturl" field="highlighturl" options={[
                                                        { value: 'https://rpa.casthighlight.com/', label: 'rpa.casthighlight.com' },
                                                        { value: 'https://app.casthighlight.com/', label: 'app.casthighlight.com' },
                                                        { value: 'https://cloud.casthighlight.com/', label: 'cloud.casthighlight.com' },
                                                        { value: 'https://demo.casthighlight.com/', label: 'demo.casthighlight.com' },
                                                    ]} object={configuration} setChange={setConfiguration} />

                                                    <div className='flex w-full items-end'>
                                                        <InputField fieldName="highlightlogin" field="highlightlogin" object={configuration} setChange={setConfiguration} default={configuration?.highlightlogin || ""} />
                                                        <InputPasswordField type="password" fieldName="highlightpassword" field="highlightpassword" object={configuration} setChange={setConfiguration} default={configuration?.highlightpassword || ""} />
                                                        <InputFloatField fieldName="Company ID" field="highlightinstance" object={configuration} setChange={setConfiguration} default={configuration?.highlightinstance || ""} />
                                                    </div>
                                                </div>

                                                <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Imaging" />
                                                <div role="tabpanel" className="tab-content p-1">
                                                    <InputField fieldName="neo4jserver" field="neo4jserver" object={configuration} setChange={setConfiguration} default={configuration?.vm_url} />
                                                    <div className='flex w-full items-end'>
                                                        <InputField fieldName="neo4jlogin" field="neo4jlogin" object={configuration} setChange={setConfiguration} default={configuration?.neo4jlogin || "neo4j"} />
                                                        <InputField fieldName="neo4jpassword" field="neo4jpassword" object={configuration} setChange={setConfiguration} default={configuration?.neo4jpassword || "imaging"} />
                                                        <InputFloatField fieldName="neo4jport" field="neo4jport" object={configuration} setChange={setConfiguration} default={configuration?.neo4jport || 7687} />
                                                    </div>
                                                </div>

                                                <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="AIP " />
                                                <div role="tabpanel" className="tab-content p-1">
                                                    <InputField fieldName="aiprestserver" field="aiprestserver" object={configuration} setChange={setConfiguration} default={configuration?.vm_url} />
                                                    <div className='flex w-full items-end'>
                                                        <InputField fieldName="aiprestlogin" field="aiprestlogin" object={configuration} setChange={setConfiguration} default={configuration?.aiprestlogin || "admin"} />
                                                        <InputField fieldName="aiprestpassword" field="aiprestpassword" object={configuration} setChange={setConfiguration} default={configuration?.aiprestpassword || "admin"} />
                                                        <InputFloatField fieldName="aiprestport" field="aiprestport" object={configuration} setChange={setConfiguration} default={configuration?.aiprestport || 8087} />
                                                    </div>
                                                </div>

                                                <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="ImagingREST" />
                                                <div role="tabpanel" className="tab-content p-1">
                                                    <InputField fieldName="imagingrestserver" field="imagingrestserver" object={configuration} setChange={setConfiguration} default={configuration?.vm_url} />
                                                    <div className='flex w-full items-end'>
                                                        <InputField fieldName="imagingrestlogin" field="imagingrestlogin" object={configuration} setChange={setConfiguration} default={configuration?.imagingrestlogin || "admin"} />
                                                        <InputField fieldName="imagingrestpassword" field="imagingrestpassword" object={configuration} setChange={setConfiguration} default={configuration?.imagingrestpassword || "admin"} />
                                                        <InputFloatField fieldName="imagingrestport" field="imagingrestport" object={configuration} setChange={setConfiguration} default={configuration?.imagingrestport || 8083} />
                                                    </div>
                                                </div>

                                                <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="PostgreSQL" />
                                                <div role="tabpanel" className="tab-content p-1">
                                                    <InputField fieldName="postgresserver" field="postgresserver" object={configuration} setChange={setConfiguration} default={configuration?.vm_url} />
                                                    <div className='flex w-full items-end'>
                                                        <InputField fieldName="postgreslogin" field="postgreslogin" object={configuration} setChange={setConfiguration} default={configuration?.postgreslogin || "operator"} />
                                                        <InputField fieldName="postgrespassword" field="postgrespassword" object={configuration} setChange={setConfiguration} default={configuration?.postgrespassword || "CastAIP"} />
                                                        <InputFloatField fieldName="postgresport" field="postgresport" object={configuration} setChange={setConfiguration} default={configuration?.postgresport || 2284} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='w-1/2 m-2'>
                                            {!props.addModal &&
                                                <div>
                                                    <h3 className="font-medium text-lg">Create an app in train</h3>
                                                    <div className='flex justify-between'>
                                                        <div className='flex flex-col w-1/2'>
                                                            <label className="form-control w-full mr-1">
                                                                <span className="label label-text">App name</span>
                                                                <input type="text" placeholder="Type here" className="input input-sm input-bordered w-full"
                                                                    id="TrainAppName" value={trainAppName} onChange={(e) => setTrainAppName(e.target.value)}
                                                                />
                                                            </label>
                                                            <button className="btn btn-outline btn-neutral mt-2" type="button" onClick={() => createAppTrain(trainAppName)}>Add app to train</button>

                                                            <div className="overflow-x-auto max-h-60 border rounded-xl mt-2">
                                                                <table className="table">
                                                                    <thead className='bg-gray-300'>
                                                                        <tr><th>Existing app in train</th></tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {appTrain.map((app, index) => {
                                                                            return <tr key={index}><td>
                                                                                <div className='flex justify-between'>
                                                                                {app.application_name} - ID: {app.train_id}
                                                                                <button className="btn btn-sm btn-circle btn-ghost ml-2" onClick={() => navigate('/pipeline/' + app.train_id)}>
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                                                        <path fillRule="evenodd" d="M15.75 2.25H21a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V4.81L8.03 17.03a.75.75 0 0 1-1.06-1.06L19.19 3.75h-3.44a.75.75 0 0 1 0-1.5Zm-10.5 4.5a1.5 1.5 0 0 0-1.5 1.5v10.5a1.5 1.5 0 0 0 1.5 1.5h10.5a1.5 1.5 0 0 0 1.5-1.5V10.5a.75.75 0 0 1 1.5 0v8.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V8.25a3 3 0 0 1 3-3h8.25a.75.75 0 0 1 0 1.5H5.25Z" clipRule="evenodd" />
                                                                                    </svg>
                                                                                </button>
                                                                                </div>
                                                                            </td></tr>
                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <div className='flex flex-col w-1/2 ml-2'>

                                                            <button className="btn flex btn-outline btn-neutral mt-2" disabled={portfolio} type="button" onClick={createPortfolio}>{!portfolio ? "Create portfolio pipeline" : "Portfolio already exist"}</button>

                                                            <div className="overflow-x-auto max-h-60 border rounded-xl mt-2">
                                                                <table className="table">
                                                                    <thead className='bg-gray-300'>
                                                                        <tr><th>Existing app in Highlight</th></tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {appHighlight.map((app, index) => {
                                                                            return <tr key={index}><td>
                                                                                <div className='flex justify-between'>{app.name}
                                                                                <button className="btn btn-sm btn-circle btn-ghost ml-2" disabled={appTrain.map(x=> x.application_name).includes(app.name)} onClick={() => createAppTrain(app.name)}>
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                                                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                                                                                    </svg>
                                                                                </button>
                                                                                </div>
                                                                            </td></tr>
                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>


                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <input type="radio" name="my_main_tabs" role="tab" className="tab min-w-max pl-5" aria-label="Task list" />
                                <div role="tabpanel" className="tab-content pt-5 min-h-[55vh]">
                                    <div className='flex flex-col'>
                                        {/* Task List */}
                                        <h3 className="font-medium text-lg">Task list - Still in dev</h3>
                                        <ul className="timeline justify-between">

                                            <li>
                                                <div className="timeline-middle">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5  text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                                </div>
                                                <div className="timeline-end timeline-box">
                                                    <div className="text-lg font-black">Qualification</div>
                                                    <div>Task 1: Complete assignment</div>
                                                    <div>Task 2: Complete assignment</div>
                                                    <div>Task 3: Complete assignment</div>
                                                </div>
                                                <hr className="bg-primary" />
                                            </li>
                                            <li>
                                                <hr className="bg-primary" />
                                                <div className="timeline-middle ">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                                </div>
                                                <div className="timeline-end timeline-box">
                                                    <div className="text-lg font-black">Execution</div>
                                                    <div>Task 1: Complete assignment</div>
                                                    <div>Task 2: Complete assignment</div>
                                                    <div>Task 3: Complete assignment</div>
                                                </div>
                                                <hr className="bg-primary" />
                                            </li>
                                            <li>
                                                <hr className="bg-primary" />
                                                <div className="timeline-end timeline-box">
                                                    <div className="text-lg font-black">Analysis</div>
                                                    <div>Task 1: Complete assignment</div>
                                                    <div>Task 2: Complete assignment</div>
                                                    <div>Task 3: Complete assignment</div>
                                                </div>
                                                <div className="timeline-middle">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                                </div>
                                                <hr />
                                            </li>
                                            <li>
                                                <hr />
                                                <div className="timeline-middle">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                                </div>
                                                <div className="timeline-end timeline-box">
                                                    <div className="text-lg font-black">Done</div>
                                                    <div>Task 1: Complete assignment</div>
                                                    <div>Task 2: Complete assignment</div>
                                                    <div>Task 3: Complete assignment</div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="h-4" ></div>
                            {
                                props.addModal ?
                                    <div className='flex justify-end'>
                                        <button className="btn m-2" type="button" onClick={addProject}>Add</button>
                                    </div>
                                    :
                                    <div className='flex justify-between'>
                                        <button className="btn m-2 btn-outline btn-error " type="button" onClick={deleteProject}>Delete</button>
                                        <button className="btn m-2" type="button" onClick={updateProject}>Update</button>
                                    </div>
                            }

                            {user.email == 'e.lagrange@castsoftware.com' ? <button className="btn m-2" type="button" onClick={(e) => { console.log(configuration) }}>consoleLog</button> : ""}
                        </div>

                    </div>
                </div >
            }
        </div >

    )
}

export default ModalProject