// Tracking submission utility using iframe method (similar to messageSubmission.ts)
// This bypasses CORS restrictions and directly submits to w2x-engine.php

interface TrackingSubmissionParams {
  contactId: string;
  documentUrl: string;
  actionType: string;
  documentTitle?: string;
  ipAddress: string;
  country: string;
  city: string;
}

/**
 * Submit tracking data via iframe to w2x-engine.php endpoint
 * This method is proven to work and bypasses CORS restrictions
 */
export const submitTrackingViaIframe = async (
  params: TrackingSubmissionParams
): Promise<boolean> => {
  console.log('[submitTrackingViaIframe] Starting submission with params:', params);
  
  return new Promise((resolve) => {
    try {
      // Create a hidden iframe
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.name = 'tracking_frame';
      document.body.appendChild(iframe);

      // Prepare a helper to setup and submit the form inside the iframe document
      const setupAndSubmit = () => {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) return;

        // Create the form within the iframe's document context
        const form = iframeDoc.createElement('form');
        form.method = 'POST';
        form.action = 'https://realintelligence.com/customers/expos/00D5e000000HEcP/exhibitors/engine/w2x-engine.php';
        form.target = 'tracking_frame';

        // Add form fields matching the w2x-engine.php expected format
        const fields: { [key: string]: string } = {
          'sObj': 'ri__Portal__c',
          'string_ri__Contact__c': params.contactId,
          'text_ri__Login_URL__c': params.documentUrl,
          'text_ri__Action__c': params.actionType,
          'text_ri__IP_Address__c': params.ipAddress,
          'text_ri__Login_Country__c': params.country,
          'text_ri__Login_City__c': params.city
        };

        // Add document title if provided
        if (params.documentTitle) {
          fields['text_ri__Document_Title__c'] = params.documentTitle;
        }

        // Create hidden input fields inside the iframe document
        Object.entries(fields).forEach(([name, value]) => {
          const input = iframeDoc.createElement('input');
          input.type = 'hidden';
          input.name = name;
          input.value = value;
          form.appendChild(input);
        });

        // Append form to iframe and submit
        iframeDoc.body.appendChild(form);

        console.log('[submitTrackingViaIframe] Submitting form to w2x-engine.php');
        form.submit();
      };

      // Ensure the iframe document is ready
      if (iframe.contentDocument?.readyState === 'complete') {
        setupAndSubmit();
      } else {
        iframe.onload = setupAndSubmit;
        // Load about:blank to guarantee a same-origin document we can write into
        iframe.src = 'about:blank';
      }

      // Clean up after a delay
      setTimeout(() => {
        document.body.removeChild(iframe);
        console.log('[submitTrackingViaIframe] Iframe removed, submission complete');
        resolve(true);
      }, 2000);

    } catch (error) {
      console.error('[submitTrackingViaIframe] Error during submission:', error);
      resolve(false);
    }
  });
};
