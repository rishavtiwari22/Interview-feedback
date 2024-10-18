
// src/MentorReportForm.js
import { useState } from 'react';
import './MentorReportForm.css';
import { GoogleGenerativeAI } from "@google/generative-ai";

const MentorReportForm = () => {
  const [studentEmail, setStudentEmail] = useState('');
  const [Interviewer, setInterviewer] = useState('');
  const [dateOfReport, setDateOfReport] = useState('');
  const [feedback, setFeedback] = useState('');
  const [bestPerformance, setBestPerformance] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!studentEmail || !dateOfReport || !feedback || !bestPerformance || !suggestions) {
      setError('Please fill in all fields.');
      return;
    }

    const formData = {
      studentEmail,
      Interviewer,
      dateOfReport,
      feedback,
      bestPerformance,
      suggestions,
    };
    console.log('Form data:', formData);

    // Analyze the data
    const genAI = new GoogleGenerativeAI("AIzaSyDD6Tf5lWYn0ePYNgYU0R5bSi9vmDNbjL4");

    async function analyzeData() {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


      // const prompt = `Student Name: ${studentEmail} 
      //     Date of Report: ${dateOfReport} 
      //     Feedback: ${feedback} 
      //     Best Performance: ${bestPerformance} 
      //     Suggestions for Improvement: ${suggestions}
      //     Please provide a detailed summary of this interview report. Highlight key points in a "glow and grow" format also without using and bold text, where "glow" refers to the mentee's best performances and "grow" pertains to suggestions for improvement. 
      //     Write the summary as if the Interviewer is speaking in the first person, addressing the mentee in the second person. Use the student's and Interviewer's name instead of their email in the feedback section. 
      //     The summary should include:
      //     1. The student's feedback.
      //     2. A highlight of the student's glow topics.
      //     3. Constructive suggestions for improvement based on the feedback provided for grow.
      //     5. Make sure you are not using any bold formatting in the text and din't use any * in the text.
      //     6. Make it more goodlooking it should look like profetional emailbody makesure dont use any star (*) for making bold text.

      //     Finally, conclude the summary with encouraging lines to support the students and foster a positive outlook. Ensure that the text is clear and supportive, without any bold formatting.`;

      const prompt = `Student Name: ${studentEmail} 
          Interviewer Name: ${Interviewer}
          Date of Report: ${dateOfReport} 
          Feedback: ${feedback} 
          Best Performance: ${bestPerformance} 
          Suggestions for Improvement: ${suggestions}
          
          Please draft a detailed summary of this interview report using a "glow and grow" format. In this format, "glow" refers to the student's best performances, while "grow" addresses areas for improvement. Write the summary as if I, the Interviewer, am speaking directly to the student, using their name in place of their email.

          The summary should include:
          1. A warm introduction acknowledging the student's effort.
          2. A highlight of the positive aspects of the student's performance (glow).
          3. Constructive suggestions for areas that need improvement (grow).
          4. Specific topics that the student should focus on more, based on the feedback and observations during the interview.
          5. A recap of the feedback provided by the student.
          6. An encouraging conclusion to motivate the student and emphasize a positive outlook.

          Make sure the summary is formatted as a professional email, maintaining a clear and supportive tone. Avoid using any bold text, asterisks, or other symbols for emphasis. Focus on making the message look professional, engaging, and easy to read.`;


      const result = await model.generateContent(prompt);
      const response = await result.response;
      let summary = response.text();
      console.log(summary);



      // Send data to Google Sheets
      const sheetResponse = await fetch('https://script.google.com/macros/s/AKfycbzm3tVIilplqODiSSQi9F-fZ_5qWAS1PMTOtLUeVDUd1y1-2wqMvZ5UJ8N3ql110AfS/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
          studentEmail,
          Interviewer,
          dateOfReport,
          summary,
        }),
      });

      if (!sheetResponse.ok) {
        alert('Report submitted successfully!');
        throw new Error('Network response was not ok');
      }

      const data = await sheetResponse.json();
      console.log('Response from Google Sheets:', data);






      //Reset form fields after submission
      setStudentEmail('');
      setInterviewer('')
      setDateOfReport('');
      setFeedback('');
      setBestPerformance('');
      setSuggestions('');
    }
    analyzeData();
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Mock interview feedback</h2>
        {error && <p className="error">{error}</p>}
        <div className="form-grid">
          <div className="form-group">
            <label>Students Name:</label>
            <input type="text" placeholder='Name' value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Date of Report:</label>
            <input type="date" value={dateOfReport} onChange={(e) => setDateOfReport(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Best Performance:</label>
            <textarea value={bestPerformance} placeholder='Glow'  onChange={(e) => setBestPerformance(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Suggestions for Improvement:</label>
            <textarea value={suggestions} placeholder='Grow' onChange={(e) => setSuggestions(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Interviewer Email:</label>
            <textarea value={Interviewer} placeholder='Interviewer name' onChange={(e) => setInterviewer(e.target.value)} required />
          </div>

          <div className="form-group all">
            <label>Feedback:</label>
            <textarea id='all' value={feedback} placeholder='Mix feedback' onChange={(e) => setFeedback(e.target.value)} required />
          </div>
        </div>
        <div className='btn'>
          <button type="submit">Submit Report</button>
          <a href="https://docs.google.com/spreadsheets/d/1dltveuVaqkQxTg1mp3dCK4C8psT8VFBNXn3V4AIXw1A/edit?gid=0#gid=0" target="_blank" rel="noopener noreferrer">
            <button type="button">Open Sheet ( Admin only )</button>
          </a>
          <p className='copyright'>Created by @Rishav Tiwari</p>
        </div>

      </form>
    </div>
  );
};

export default MentorReportForm;
