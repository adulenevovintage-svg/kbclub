import React, { useState } from 'react';
import { Club, UserProfile, JournalEntry } from '../types';
import { X, FileText, Send, Paperclip } from 'lucide-react';
import { saveItemToFirestore } from '../services/firestoreService';
import { auth, db } from '../firebase';
import { getAccessToken } from '../firebase';

interface JournalModalProps {
  club: Club;
  student: UserProfile;
  onClose: () => void;
  onAddToast: (type: 'success' | 'warning' | 'info', title: string, message: string) => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({ club, student, onClose, onAddToast }) => {
  const [content, setContent] = useState('');

  const sendEmail = async (subject: string, body: string) => {
    const token = await getAccessToken();
    if (!token) {
      onAddToast('warning', 'Auth Required', 'Please sign in with Google to send reports.');
      return;
    }

    const rawMessage = [
      `To: ${club.advisorEmail}`,
      `Subject: ${subject}`,
      `Content-Type: text/html; charset=utf-8`,
      ``,
      body
    ].join('\r\n');

    const encodedMessage = btoa(rawMessage).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw: encodedMessage })
    });
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      studentId: student.id,
      clubId: club.id,
      content,
      date: new Date().toISOString()
    };

    try {
      await saveItemToFirestore('journal_entries', entry);
      
      // Send report to advisor
      await sendEmail(
        `Journal Report: ${student.name} - ${club.name}`,
        `<p>Student: ${student.name}</p><p>Club: ${club.name}</p><p>Date: ${new Date().toLocaleDateString()}</p><br><p>${content}</p>`
      );

      onAddToast('success', 'Journal Submitted', 'Your report has been sent to the advisor.');
      onClose();
    } catch (error) {
      onAddToast('warning', 'Submission Failed', 'Could not save journal or send email.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 w-full max-w-lg rounded-2xl p-6 border border-zinc-700 shadow-xl text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Journal for {club.name}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-zinc-400" /></button>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-40 p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white mb-4"
          placeholder="Write your notes or journal entry here..."
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-zinc-700 rounded-lg text-xs font-bold">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-emerald-600 rounded-lg text-xs font-bold flex items-center gap-2">
            <Send className="w-3.5 h-3.5" /> Submit & Send
          </button>
        </div>
      </div>
    </div>
  );
};
