import React, { useState } from "react";
import PageHeader from "@/components/UI/PageHeader.component";
import GenericForm from "@/components/UI/GenericForm.component";
import { formSchema, formFields, FormData } from "@/components/Kontakt/config/formConfig";

/**
 * A special version of KontaktContent for stories
 * This prevents actual emails from being sent by having its own
 * onSubmit handler that simulates success or failure
 */

type Props = {
  simulateError?: boolean;
  initialResponse?: string;
};

const KontaktWithMocks: React.FC<Props> = ({ 
  simulateError = false,
  initialResponse = ""
}) => {
  const [serverResponse, setServerResponse] = useState<string>(initialResponse);

  /**
   * Simulated form submission that doesn't make any actual API calls
   */
  const onSubmit = async (data: FormData): Promise<void> => {
    console.log("Form submitted with data:", data);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (simulateError) {
      setServerResponse("Feil under sending av skjema");
    } else {
      setServerResponse("Takk for din beskjed");
    }
  };

  return (
    <main data-testid="kontaktcontent" id="maincontent">
      <div className="mt-32 bg-graybg">
        <PageHeader>Kontakt</PageHeader>
        <div className="px-4 lg:px-0 xl:px-0 md:px-0">
          <div className="container mx-auto bg-slate-700 rounded-sm shadow-sm sm:mb-4">
            <div className="p-4 mx-auto md:h-full mt-4 flex flex-col justify-center items-center min-h-[470px]">
              <div className="p-2 md:p-6 pt-8">
                {serverResponse ? (
                  <h3 className="m-2 h-32 text-xl text-center text-gray-300">
                    {serverResponse}
                  </h3>
                ) : (
                  <div className="bg-gray-800 p-4 md:p-6 rounded-lg pt-8">
                    <GenericForm<typeof formSchema>
                      formSchema={formSchema}
                      onSubmit={onSubmit}
                      fields={formFields}
                      submitButtonText="Send skjema"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default KontaktWithMocks;
