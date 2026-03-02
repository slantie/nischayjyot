-- Migration 00005: Seed FAQ Data (English + Hindi + Gujarati)
-- Requires: 00002_create_tables.sql

INSERT INTO faqs (question, answer, category, display_order, language) VALUES

-- ── English FAQs ──────────────────────────────────────────────────────────────

('What is ONOC (One Nation One Challan)?',
'ONOC (One Nation One Challan) is a Government of India initiative to standardize and unify traffic fine management across the country. It ensures that traffic challans issued in one state are accessible and enforceable across the nation through a centralized digital system.',
'general', 1, 'en'),

('What is NishchayJyot?',
'NishchayJyot is a citizen grievance redressal portal specifically designed for the ONOC traffic challan system. It allows citizens to lodge, track, and resolve grievances related to incorrect or disputed e-challans issued under the ONOC initiative.',
'general', 2, 'en'),

('How do I lodge a grievance?',
'You can lodge a grievance in two ways: (1) Use our AI Chatbot — enter your vehicle number and the chatbot will fetch your challan details and guide you through the grievance registration process. (2) Use the manual form on the Track Grievance page to submit your grievance with all required details.',
'grievance', 3, 'en'),

('What documents do I need to file a grievance?',
'To file a grievance, you need: your vehicle registration number, the challan number (if available), a clear description of the issue, and any supporting evidence (photos, documents) that support your claim. Supporting evidence can be uploaded as JPG, PNG, or PDF files (max 5MB each).',
'grievance', 4, 'en'),

('How long does it take to resolve a grievance?',
'Standard grievances are typically reviewed within 7-15 working days. Urgent cases (such as false challans or documents impounded) are prioritized and reviewed within 3-5 working days. You will receive real-time notifications as your grievance status changes.',
'grievance', 5, 'en'),

('What is a Virtual Traffic Court?',
'A Virtual Traffic Court eliminates the need for physical court appearances. If a challan remains unpaid for 60 days, it is forwarded to a Virtual Traffic Court for proceedings. Court number 16 of Ahmedabad City Sessions Court is designated as the virtual court for all Gujarat ONOC cases.',
'legal', 6, 'en'),

('Can I dispute a challan if I was not driving the vehicle?',
'Yes. If the challan was issued for a vehicle you own but you were not the driver at the time, you can file a grievance under the category "Wrong Vehicle" or "False Challan". Provide evidence such as the name of the actual driver, documents proving you were elsewhere, or any relevant proof.',
'grievance', 7, 'en'),

('What happens if I pay a challan that was incorrectly issued?',
'If you pay a challan that was later found to be incorrectly issued, you can file a grievance requesting a refund. Select the category "Payment Issue" and provide your payment receipt and the challan details. Our team will review and process the refund through appropriate channels.',
'payment', 8, 'en'),

('How can I check the status of my grievance?',
'You can track your grievance status in real-time through the "Track Grievance" section of your dashboard. Each grievance shows its current status (Open, In Progress, Under Review, Resolved, Rejected, or Escalated) along with a timeline of all actions taken.',
'grievance', 9, 'en'),

('What is the VISWAS project?',
'VISWAS (Video Integration and State-wide Advanced Security) is the Gujarat Home Department''s initiative involving 7000+ CCTV cameras across the state for safety and traffic management. This infrastructure captures traffic violations and generates the e-challans in the ONOC system.',
'general', 10, 'en'),

('What cities are covered under ONOC in Gujarat?',
'The ONOC pilot in Gujarat currently covers: Ahmedabad, Rajkot, Gandhinagar, Vadodara, and Surat. NishchayJyot handles grievances from all these cities.',
'general', 11, 'en'),

('Can I appeal a rejected grievance?',
'Yes. If your grievance is rejected, you can escalate it by contacting the admin team with additional evidence. Select the "Escalated" option or contact support with your ticket number. Escalated cases are reviewed by senior administrators.',
'grievance', 12, 'en'),

-- ── Hindi FAQs ────────────────────────────────────────────────────────────────

('ONOC (वन नेशन वन चालान) क्या है?',
'ONOC (वन नेशन वन चालान) भारत सरकार की एक पहल है जो देशभर में ट्रैफिक जुर्माना प्रबंधन को मानकीकृत और एकीकृत करती है। यह सुनिश्चित करती है कि एक राज्य में जारी ट्रैफिक चालान एक केंद्रीकृत डिजिटल सिस्टम के माध्यम से पूरे देश में सुलभ और लागू हो।',
'general', 1, 'hi'),

('शिकायत कैसे दर्ज करें?',
'शिकायत दर्ज करने के दो तरीके हैं: (1) हमारे AI चैटबॉट का उपयोग करें — अपना वाहन नंबर दर्ज करें और चैटबॉट आपके चालान का विवरण प्राप्त करेगा और शिकायत पंजीकरण प्रक्रिया में मार्गदर्शन करेगा। (2) अपनी शिकायत के सभी आवश्यक विवरणों के साथ मैन्युअल फॉर्म का उपयोग करें।',
'grievance', 2, 'hi'),

('शिकायत का स्टेटस कैसे ट्रैक करें?',
'आप अपने डैशबोर्ड के "ट्रैक ग्रीवेंस" सेक्शन में रियल-टाइम में अपनी शिकायत की स्थिति ट्रैक कर सकते हैं। प्रत्येक शिकायत अपनी वर्तमान स्थिति (ओपन, इन प्रोग्रेस, अंडर रिव्यू, रिज़ॉल्व्ड, रिजेक्टेड, या एस्केलेटेड) के साथ सभी कार्रवाइयों की टाइमलाइन दिखाती है।',
'grievance', 3, 'hi'),

-- ── Gujarati FAQs ─────────────────────────────────────────────────────────────

('ONOC (વન નેશન વન ચલણ) શું છે?',
'ONOC (વન નેશન વન ચલણ) એ ભારત સરકારની એક પહેલ છે જે દેશભરમાં ટ્રાફિક દંડ વ્યવસ્થાપનને પ્રમાણિત અને એકીકૃત કરે છે. તે સુનિશ્ચિત કરે છે કે એક રાજ્યમાં જારી ટ્રાફિક ચલણ કેન્દ્રીય ડિજિટલ સિસ્ટમ દ્વારા સમગ્ર દેશમાં સુલભ અને પ્રવર્તમાન હોય.',
'general', 1, 'gu'),

('ફરિયાદ કેવી રીતે નોંધાવવી?',
'ફરિયાદ નોંધાવવાના બે રસ્તા છે: (1) અમારા AI ચેટબૉટનો ઉપયોગ કરો — તમારો વાહન નંબર દાખલ કરો અને ચેટબૉટ તમારા ચલણ વિગતો લાવશે અને ફરિયાદ નોંધણી પ્રક્રિયામાં માર્ગદર્શન આપશે. (2) ટ્રૅક ગ્રીવેન્સ પૃષ્ઠ પર મૅન્યુઅલ ફૉર્મ સાથે ફરિયાદ સબમિટ કરો.',
'grievance', 2, 'gu'),

('ફરિયાદ ઉકેલવામાં કેટલો સમય લાગે છે?',
'સ્ટાન્ડર્ડ ફરિયાદોની સામાન્ય રીતે 7-15 કામકાજી દિવસોમાં સમીક્ષા કરવામાં આવે છે. તાત્કાલિક કેસ (જેમ કે ખોટા ચલણ) 3-5 કામકાજી દિવસોમાં સમીક્ષા કરવામાં આવે છે. તમારી ફરિયાદ સ્ટેટસ બદલાય ત્યારે તમને રીઅલ-ટાઇમ સૂચનાઓ મળશે.',
'grievance', 3, 'gu');
