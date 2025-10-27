import { useState, useEffect } from 'react';
import { Formio } from '@formio/js';

const SubmissionList = ({ formUrl }) => {
  const [submissions, setSubmissions] = useState([]);
  const formio = new Formio(formUrl);

  useEffect(() => {
    const fetchSubmissions = async () => {
      formio.loadSubmissions().then((sub) => {
        //console.log('Fetched submissions:', submissions);
        setSubmissions(sub);
      });
    };

    fetchSubmissions();
  }, [formUrl]); // Re-fetch if formUrl changes

  return (
    <div>
      <h2>
        Submissions for form '{formUrl.substring(formUrl.lastIndexOf('/') + 1)}'
      </h2>
      <br />
      {submissions.length > 0 ? (
        <ul>
          {submissions.map((submission) => (
            <li key={submission._id}>
              Submission ID: {submission._id}
              {/* Display other submission data as needed */}
              <pre>{JSON.stringify(submission.data, null, 2)}</pre>
            </li>
          ))}
        </ul>
      ) : (
        <p>No submissions found for this form.</p>
      )}
    </div>
  );
};

export default SubmissionList;
