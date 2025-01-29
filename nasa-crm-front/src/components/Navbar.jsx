import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import InputField from './inputs/InputField';
import InputPasswordField from './inputs/InputPasswordField';

function Navbar() {
    const [configuration, setConfiguration] = useState({});
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        getConfiguration();
    }, []);

    const getConfiguration = async () => {
        try {
            const response = await api.get('/configurations');
            if (response.data && response.data.length > 0) {
                setConfiguration(response.data[0]); // Set the first configuration from the response
                console.log("Configuration fetched:", response.data[0]);
            } else {
                console.log("No configurations found");
            }
        } catch (error) {
            toast.error(error.message);
            console.error("Error fetching configurations:", error);
        }
    };

    const updateConfiguration = async () => {
      if (!configuration || !configuration.infraconfig_id) {
          toast.error("Invalid configuration data");
          return;
      }
  
      try {
          console.log("Updating configuration with ID:", configuration.infraconfig_id);
          await api.put('/configurations/' + configuration.infraconfig_id, { data: configuration });
          setIsOpen(false);
          toast.success("Configuration updated");
      } catch (error) {
          toast.error(error.message);
          console.error("Error updating configuration:", error);
      }
  };
  

    return (
        <div className="navbar bg-black bg-opacity-60 shadow-md h-16 text-white m-0">
            <div className="flex-1 flex items-center">
                <h1 className="text-xl pl-6 pr-6">OLYMPUS</h1>
                <button className="btn text pl-6 pr-6" onClick={() => setIsOpen(true)}>Admin</button>
            </div>

            {isOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <div className="modal-action m-0">
                            <button onClick={(e) => setIsOpen(false)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </div>

                        <h3 className="font-bold text-lg">Highlight</h3>
                        <InputField fieldName="Highlight Login" field="highlightlogin" object={configuration} setChange={setConfiguration} default={configuration.highlightlogin} />
                        <InputPasswordField fieldName="Highlight Password" field="highlightpassword" object={configuration} setChange={setConfiguration} default={configuration.highlightpassword} />
                        <InputField fieldName="Highlight URL" field="highlighturl" object={configuration} setChange={setConfiguration} default={configuration.highlighturl} />
                        <InputField fieldName="Highlight Instance" field="highlightinstance" object={configuration} setChange={setConfiguration} default={configuration.highlightinstance} />
                        
                        <h3 className="font-bold text-lg pt-4">Neo4j</h3>
                        <InputField fieldName="Neo4j Login" field="neo4jlogin" object={configuration} setChange={setConfiguration} default={configuration.neo4jlogin} />
                        <InputPasswordField fieldName="Neo4j Password" field="neo4jpassword" object={configuration} setChange={setConfiguration} default={configuration.neo4jpassword} />
                        <InputField fieldName="Neo4j Server" field="neo4jserver" object={configuration} setChange={setConfiguration} default={configuration.neo4jserver} />
                        <InputField fieldName="Neo4j Port" field="neo4jport" object={configuration} setChange={setConfiguration} default={configuration.neo4jport} />

                        <h3 className="font-bold text-lg pt-4">PostgreSQL</h3>
                        <InputField fieldName="PostgreSQL Login" field="postgreslogin" object={configuration} setChange={setConfiguration} default={configuration.postgreslogin} />
                        <InputPasswordField fieldName="PostgreSQL Password" field="postgrespassword" object={configuration} setChange={setConfiguration} default={configuration.postgrespassword} />
                        <InputField fieldName="PostgreSQL Server" field="postgresserver" object={configuration} setChange={setConfiguration} default={configuration.postgresserver} />
                        <InputField fieldName="PostgreSQL Port" field="postgresport" object={configuration} setChange={setConfiguration} default={configuration.postgresport} />

                        <h3 className="font-bold text-lg pt-4">Aip Rest</h3>
                        <InputField fieldName="Aip Rest Login" field="aiprestlogin" object={configuration} setChange={setConfiguration} default={configuration.aiprestlogin} />
                        <InputPasswordField fieldName="Aip Rest Password" field="aiprestpassword" object={configuration} setChange={setConfiguration} default={configuration.aiprestpassword} />
                        <InputField fieldName="Aip Rest Server" field="aiprestserver" object={configuration} setChange={setConfiguration} default={configuration.aiprestserver} />
                        <InputField fieldName="Aip Rest Port" field="aiprestport" object={configuration} setChange={setConfiguration} default={configuration.aiprestport} />

                        <h3 className="font-bold text-lg pt-4">Imaging Rest</h3>
                        <InputField fieldName="Imaging Rest Login" field="imagingrestlogin" object={configuration} setChange={setConfiguration} default={configuration.imagingrestlogin} />
                        <InputPasswordField fieldName="Imaging Rest Password" field="imagingrestpassword" object={configuration} setChange={setConfiguration} default={configuration.imagingrestpassword} />
                        <InputField fieldName="Imaging Rest Server" field="imagingrestserver" object={configuration} setChange={setConfiguration} default={configuration.imagingrestserver} />
                        <InputField fieldName="Imaging Rest Port" field="imagingrestport" object={configuration} setChange={setConfiguration} default={configuration.imagingrestport} />

                        <h3 className="font-bold text-lg pt-4">Project ID</h3>
                        <InputField fieldName="Project ID" field="project_id" object={configuration} setChange={setConfiguration} default={configuration.project_id} />
                        
                        <h3 className="font-bold text-lg pt-4">VM</h3>
                        <InputField fieldName="VM URL" field="vm_url" object={configuration} setChange={setConfiguration} default={configuration.vm_url} />

                        <div className="modal-action">
                        <button className="btn m-2" type="button" onClick={updateConfiguration}>Update</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;
