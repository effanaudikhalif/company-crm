import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

function Admin() {
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
        setIsOpen(true);
      } else {
        console.log("No configurations found");
        setIsOpen(false);
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
      await api.post('/configurations/' + configuration.infraconfig_id, { data: configuration });
      setIsOpen(false);
      toast.success("Configuration updated");
    } catch (error) {
      toast.error(error.message);
      console.error("Error updating configuration:", error);
    }
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Admin</button>
      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Configuration Details</h3>
            <div className="p-4">
              <InputField fieldName="VM URL" field="vm_url" object={configuration} setChange={setConfiguration} />
              <SelectField fieldName="Highlight URL" field="highlighturl" object={configuration} setChange={setConfiguration} options={[
                { value: 'https://rpa.casthighlight.com/', label: 'rpa.casthighlight.com' },
                { value: 'https://app.casthighlight.com/', label: 'app.casthighlight.com' },
                { value: 'https://cloud.casthighlight.com/', label: 'cloud.casthighlight.com' },
                { value: 'https://demo.casthighlight.com/', label: 'demo.casthighlight.com' },
              ]} />
              <InputField fieldName="Login" field="highlightlogin" object={configuration} setChange={setConfiguration} />
              <InputPasswordField fieldName="Password" field="highlightpassword" object={configuration} setChange={setConfiguration} />
              <InputFloatField fieldName="Company ID" field="highlightinstance" object={configuration} setChange={setConfiguration} />
              <button className="btn btn-primary mt-4" onClick={updateConfiguration}>Update Configuration</button>
              <button className="btn btn-ghost mt-4" onClick={() => setIsOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
