import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.resolve(__dirname, '..');

// Vite does not reliably copy dotfiles from public.
fs.mkdirSync(rootDir, { recursive: true });
fs.writeFileSync(path.join(rootDir, '.nojekyll'), '');

const nav = [
  ['/', 'Home'],
  ['/about/', 'About'],
  ['/what-we-care/', 'What We Care About'],
  ['/people/', 'People'],
  ['/output-resources/', 'Outputs & Resources'],
  ['/get-involved/', 'Get Involved'],
  ['/contact/', 'Contact'],
];

const legalNav = [
  ['/research-ethics/', 'Research Ethics'],
  ['/thank-you-prize-terms/', 'Thank-you Prize Terms and Conditions'],
  ['/accessibility/', 'Accessibility'],
  ['/privacy-policy/', 'Privacy Notice'],
  ['/terms-of-use/', 'Terms of Use'],
];

const pageContent = {
  '/': `
    <section>
      <h1>Building Identity Through Stories</h1>
      <p>We co-develop creative storytelling activities to explore how transmedia storytelling may support the identity exploration of students with diverse learning journeys during the transition into higher education.</p>
      <p><a href="/about/">Read More</a></p>
    </section>
    <section>
      <h2>Research Update</h2>
      <p>Video updates from the BITS doctoral research project are loaded from the published research playlist.</p>
      <p><a href="https://www.youtube.com/@bits-research">Visit YouTube Channel</a></p>
    </section>
    <section id="upcoming-workshops">
      <h2>Upcoming Workshops</h2>
      <p>Workshop information is loaded from the published workshop schedule. If no workshops are scheduled, visitors are invited to contact the project.</p>
    </section>
    <section id="homepage-questions">
      <h2>Questions you might have</h2>
      <p>It’s okay to check what to expect before deciding whether to join.</p>
      <details><summary>Do I need SEND or a diagnosis to join?</summary><p>No. You do not need a diagnosis or need to identify as SEND. Students without SEND can register too.</p></details>
      <details><summary>Do I need to be good at art?</summary><p>Not at all. You do not need any art or creative experience.</p></details>
      <details><summary>What actually happens in a workshop?</summary><p>You will try a short creative activity using things like words, images, colours, symbols or simple digital tools.</p></details>
      <details><summary>Will I have to speak in front of everyone?</summary><p>No. You choose how much you want to say or share.</p></details>
      <details><summary>Can I take a break or leave early?</summary><p>Yes. You can take a break or leave whenever you need to. You do not need to give a reason.</p></details>
      <p><strong>Want to know more before deciding?</strong></p>
      <p><a href="/get-involved/#frequently-asked-questions">See all questions</a> · <a href="/contact/">Contact us</a></p>
    </section>
    <section>
      <h2>Institutional Affiliation</h2>
      <p>This doctoral research is registered at the University of the Arts London and Falmouth University in the United Kingdom. This study received ethical approval from the Research Integrity &amp; Ethics Committee (Ref: RIEC 25-222) and will be conducted from 1 January 2026 to 31 December 2028.</p>
      <p><a href="https://www.arts.ac.uk/">University of the Arts London</a></p>
      <p><a href="https://www.falmouth.ac.uk/">Falmouth University</a></p>
    </section>
    <section>
      <h2>Falmouth University Learning Support and University Transition</h2>
      <p>BITS (Building Identity Through Stories) is a research project based at Falmouth University and UAL. We focus on learning support, university transition, and supporting students with diverse learning journeys through transmedia storytelling.</p>
    </section>
  `,
  '/about/': `
    <section>
      <h1>About the Research</h1>
      <p>Supporting transition through transmedia storytelling.</p>
      <p>This research study explores how students with diverse learning journeys make sense of who they are and who they want to be when entering higher education. The research focuses on how students experience changes in identity, confidence, and learning expectations during the early stages of university life, especially if they have previously encountered learning difficulties or engaged with academic or accessibility support services.</p>
      <p>The research examines transmedia storytelling as an educational intervention to help students build their sense of self during their transition to university by sharing personal stories across creative formats, like journal writing or simple digital creations on their own devices.</p>
    </section>
    <section>
      <h2>Keywords</h2>
      <ul><li>Transmedia Storytelling</li><li>Identity</li><li>Student Transition</li><li>Educational Intervention</li><li>Arts-based Educational Research</li></ul>
    </section>
    <section>
      <h2>Research Objectives</h2>
      <ol>
        <li>Look at problems and good points in current university transition programs for students with learning differences.</li>
        <li>Design and prototype transmedia storytelling interventions utilising participants' personal devices, grounded in students' lived transition experiences.</li>
        <li>Evaluate and position this intervention as a participatory, student agency-driven framework to foster identity exploration during higher education transition, thereby addressing the limitations of top-down institutional approach.</li>
      </ol>
    </section>
    <section>
      <h2>How This Project Brings Different Ideas Together</h2>
      <p>This research connects participatory arts practice with inclusive education to develop transmedia storytelling workshops for students with diverse learning journeys transitioning into higher education. Through transmedia storytelling, students will explore identity, belonging, and their learning journeys in different ways.</p>
      <img src="/images/transmedia-storytelling-workshop.png" alt="Diagram showing the BITS research framework: Transmedia Storytelling Workshops at the centre, framed as an Educational Intervention within Inclusive Education and Practice, informed by Participatory Arts Practice." />
    </section>
    <section>
      <h2>Ethical Approval</h2>
      <p>This research project has been reviewed and approved by the institutional ethics committee. All procedures meet the required ethical standards.</p>
      <p><a href="/get-involved/">Get Involved!</a></p>
    </section>
  `,
  '/people/': `
    <section>
      <h1>People</h1>
      <p>Researcher, Supervisors &amp; Advisors</p>
      <h2>Charlie Tak Hei Kwong 鄺德希</h2>
      <p>Doctoral Researcher</p>
      <p>Charlie is a doctoral researcher and registered teacher passionate about the intersection of creative media and inclusive education. His fully funded research explores how transmedia storytelling can create supportive spaces for students with diverse needs as they navigate their journey into higher education.</p>
      <p><a href="https://thkwong.uk">Website</a></p>
      <p><a href="mailto:c.kwong1220251@arts.ac.uk,tk290331@falmouth.ac.uk">Email</a></p>
      <img src="/images/charlie-kwong-profile.jpg" alt="Charlie Tak Hei Kwong" />
    </section>
    <section>
      <h2>Experience and Research Focus</h2>
      <p>Charlie's journey began as a school teacher in Hong Kong. Between his early research assistantships in education, and his time living in Hong Kong, Canada, UK, and the Netherlands, he developed an interest in the way people learn and handle the move into new chapters of their lives.</p>
      <p>After spending over eight years shaping blended learning and academic projects, Charlie has turned his focus toward making higher education more inclusive. These days, he's exploring how arts-based research and creative practice can empower and support people with diverse backgrounds.</p>
    </section>
    <section>
      <h2>Doctoral Research Supervision</h2>
      <p>This research is developed under the guidance of an interdisciplinary supervisory team:</p>
      <ul><li>Dr Jennifer Young, Director of Studies, Dean, Faculty of Design &amp; Culture</li><li>Prof. Neil Fox, Professor of Film Practice and Pedagogy</li><li>Prof. Russell Crawford, Deputy Vice-Chancellor (Interim)</li></ul>
    </section>
  `,
  '/what-we-care/': `
    <section>
      <h1>What We Care About</h1>
      <p>Our core values drive every aspect of the project.</p>
      <h2>Identity Exploration</h2>
      <p>Supporting the non-linear self-discovery of students with diverse learning journeys through transmedia storytelling during transition.</p>
      <h2>Bottom-up Empowerment</h2>
      <p>Prioritising student agency and lived narratives to overcome limitations.</p>
      <h2>Community-based Practice</h2>
      <p>Co-creation with participants and community advisors.</p>
      <h2>Ethical Safety</h2>
      <p>Ensuring trauma-informed care and privacy.</p>
      <p><a href="/get-involved/">Get Involved!</a></p>
    </section>
  `,
  '/research-update/': `
    <section>
      <h1>Research Update</h1>
      <p>Video updates loaded from the published research playlist.</p>
      <p><a href="https://www.youtube.com/@bits-research">Visit YouTube Channel</a></p>
    </section>
  `,
  '/output-resources/': `
    <section>
      <h1>Outputs and Resources</h1>
      <p>Explore our community resources and research findings.</p>
      <h2>Community Resources</h2>
      <p>Community resources are loaded from the published resource sheet.</p>
      <h2>Academic Output</h2>
      <p>Academic outputs include journal articles, book chapters, conference papers, and conference presentations from Building Identity Through Stories.</p>
    </section>
  `,
  '/get-involved/': `
    <section>
      <h1>Join the Research</h1>
      <p>Every story matters. Join our workshops to co-create support for your journey. You do not need to be good at art to take part. You can write, draw, reflect, use simple digital tools, or respond in a way that feels comfortable for you.</p>
      <h2>Join a Creative Workshop</h2>
      <p>Are you settling into uni and still figuring things out? Join our creative workshops to explore identity, belonging, and your learning journey at your own pace.</p>
      <p><a href="https://charliekwong.myblog.arts.ac.uk/2026/02/01/upcoming-workshop/">Session Details</a></p>
      <p><a href="https://forms.office.com/e/FPSgmUxEhD">Join the Session</a></p>
      <h2>Collaborate as a Community Advisor</h2>
      <p>Join us as a Community Advisor [Remote/On-site] and help shape workshop design, delivery, safeguarding, and ethical practice to better support students in transition!</p>
      <p><a href="https://charliekwong.myblog.arts.ac.uk/2026/02/01/community-advisors-wanted-supporting-identity-transition-in-higher-education/#roles">Learn More</a></p>
      <p><a href="https://forms.cloud.microsoft/e/LM0sFix788">Book My Place</a></p>
    </section>
    <section id="frequently-asked-questions">
      <h2>Frequently Asked Questions</h2>
      <p>Thinking about joining a BITS workshop? Here are some questions you might have.</p>
      <nav aria-label="Frequently asked question categories">
        <a href="#faq-before-you-join">Before You Join</a> ·
        <a href="#faq-what-to-expect">What to Expect</a> ·
        <a href="#faq-access-and-comfort">Access &amp; Comfort</a> ·
        <a href="#faq-research-and-privacy">Research &amp; Privacy</a>
      </nav>
      <p>21 questions</p>
      <h3 id="faq-before-you-join">Before You Join</h3>
      <details><summary>Who can take part?</summary><p>BITS workshops are open to students aged 18 or over who are in their first or foundation year of university. The research particularly focuses on students with different learning experiences. You do not need to have SEND or a diagnosis to register. If places are limited, priority will be given to students whose learning experiences are most relevant to the research.</p></details>
      <details><summary>Do I need SEND or a diagnosis to join?</summary><p>No. You do not need a formal diagnosis, and you do not need to identify as SEND or disabled. Students without SEND can register too. You will not be asked to prove that you have a diagnosis.</p></details>
      <details><summary>Do I need to be good at art?</summary><p>Not at all. You do not need any art or creative experience. The activities are about exploring your ideas and experiences, not making something that looks good.</p></details>
      <details><summary>Is taking part part of my course?</summary><p>No. Taking part in BITS research is voluntary and separate from your course. Choosing not to take part will not affect your studies or university support.</p></details>
      <details><summary>Is there a thank-you for taking part?</summary><p>You may be eligible for an optional lucky draw for a local grocery gift card worth up to £10. Some workshop activities may also include a small journal to use during the session.</p></details>
      <details><summary>Who will I meet at the workshop?</summary><p>Charlie Kwong, the researcher behind BITS, will run the workshop. Depending on the session, there may also be a facilitator or Community Advisor helping with the workshop.</p></details>
      <h3 id="faq-what-to-expect">What to Expect</h3>
      <details><summary>What actually happens in a workshop?</summary><p>You will be invited to try a short creative activity around things like identity, experiences and starting university. This might involve writing, images, colours, symbols or simple digital storytelling.</p></details>
      <details><summary>How many people will be there?</summary><p>Usually around 10–15 students may take part in each workshop round. The exact number may vary depending on the session.</p></details>
      <details><summary>Will I have to speak in front of everyone?</summary><p>No. You will not be expected to speak in front of the group if you do not want to.</p></details>
      <details><summary>Do I have to talk about personal or difficult experiences?</summary><p>No. You choose what you want to explore and what you want to keep private.</p></details>
      <details><summary>What if I don't know what to make or say?</summary><p>That's fine. You do not need to arrive with a story or idea ready. There will be prompts and choices to help you get started.</p></details>
      <h3 id="faq-access-and-comfort">Access &amp; Comfort</h3>
      <details><summary>Can I take a break or leave early?</summary><p>Yes. You can pause, take a break or leave if you need to. You can also skip an activity or decide not to continue.</p></details>
      <details><summary>Can I communicate in a way that works for me?</summary><p>You do not always have to respond by speaking. Depending on the activity, you may be able to write, use images or symbols, create something, or use a digital approach instead.</p></details>
      <details><summary>Can I ask for accessibility support?</summary><p>Yes. If there is something that could make the workshop easier or more comfortable for you, please let Charlie know.</p></details>
      <h3 id="faq-research-and-privacy">Research &amp; Privacy</h3>
      <details><summary>Is this a research study?</summary><p>Yes. BITS is a doctoral research project led by Charlie Kwong at Falmouth University.</p></details>
      <details><summary>What am I agreeing to?</summary><p>Before taking part, you will receive information explaining the research and what participation involves. Consent is an ongoing choice throughout the research.</p></details>
      <details><summary>Can I change my mind?</summary><p>Yes. Taking part is voluntary, and you can choose to withdraw without giving a reason.</p></details>
      <details><summary>What happens to what I create or share?</summary><p>Creative work will only be collected and analysed as research where you have given consent.</p></details>
      <details><summary>Will I be recorded?</summary><p>There will be no video recording of you during the workshops. Audio may be recorded for parts of the research, but only with your consent.</p></details>
      <details><summary>Will my name be used?</summary><p>Your research data will normally be anonymised or pseudonymised rather than published using your full name.</p></details>
      <details><summary>Who can I contact if I have a question?</summary><p>You can contact Charlie Kwong through the BITS contact page.</p></details>
    </section>
  `,
  '/contact/': `
    <section>
      <h1>Contact Us</h1>
      <p>Use this form or email to contact Building Identity Through Stories about research participation, workshop interest, collaboration, accessibility needs, or general enquiries.</p>
      <form method="post" action="https://script.google.com/macros/s/AKfycbzoAqYltv9zlFk5LeoNhy-p1rp7rjD6i7GGtw19osIYGI2abGPLwqJaQ1-kJXq7OVMeew/exec">
        <p><label>Name <input name="Name" required /></label></p>
        <p><label>Role <select name="Role" required><option value="">Select your role</option><option>Student / Potential Participant</option><option>Community Advisor</option><option>Academic / Researcher</option><option>University Staff</option><option>Accessibility or Student Support Staff</option><option>General Enquiry</option><option>Other</option></select></label></p>
        <p><label>Email <input name="Email" type="email" required /></label></p>
        <p><label>Message <textarea name="Message" required></textarea></label></p>
        <p><button type="submit">Send Message</button></p>
      </form>
    </section>
  `,
  '/privacy-policy/': `
    <section>
      <h1>Privacy Notice</h1>
      <p>Last updated: 24 August 2026</p>
      <p>This website is maintained by <strong>Charlie Tak Hei Kwong</strong>, a doctoral researcher at Falmouth University undertaking a research degree registered with the University of the Arts London (UAL).</p>
      <p>The website is used for academic communication, participant information and research dissemination relating to the BITS research project.</p>
      <p>This is a static website hosted using <strong>GitHub Pages</strong>.</p>
      <p>The researcher does not use website analytics, advertising technologies, behavioural tracking or profiling tools on this website.</p>
      <p>However, GitHub, as the website hosting provider, processes limited technical information when visitors access a GitHub Pages website, as explained below.</p>
    </section>
    <section>
      <h2>1. Information You May Provide</h2>
      <p>You may choose to provide personal information through contact, registration, participation or feedback forms linked from this website.</p>
      <p>Depending on the purpose of the form, this may include information such as:</p>
      <ul>
        <li>your name or preferred name</li>
        <li>email address</li>
        <li>information relevant to workshop participation</li>
        <li>learning or accessibility preferences</li>
        <li>feedback about the research or project activities</li>
      </ul>
      <p>The information requested will be explained at the point of collection.</p>
      <p>Information you provide will only be used for the stated purpose, which may include:</p>
      <ul>
        <li>responding to enquiries</li>
        <li>communicating about the research project</li>
        <li>arranging participation in workshops or research activities</li>
        <li>managing research participation</li>
        <li>collecting feedback about the project</li>
      </ul>
      <p>Where information is collected for research purposes, access will be limited to the researcher and, where necessary, the supervisory team and authorised institutional staff or research committees in accordance with the approved research arrangements.</p>
      <p>Personal information will not be used for advertising, commercial profiling or unrelated marketing.</p>
      <p>Information may also be disclosed where required by law or where you have specifically agreed to its disclosure.</p>
    </section>
    <section>
      <h2>2. External Forms and Services</h2>
      <p>Some forms used by the project may be provided through external services such as <strong>Microsoft Forms</strong> or <strong>Google Forms</strong>.</p>
      <p>When you use one of these services, information may also be processed by the relevant service provider according to its own privacy and data-protection practices.</p>
      <p>The purpose of the form and how the information will be used will be explained before information is collected.</p>
      <p>Where a form is used for research participation, the relevant Participant Information Sheet and consent information will provide additional information about research data, confidentiality, withdrawal and retention.</p>
    </section>
    <section>
      <h2>3. Accessibility Preferences and Local Storage</h2>
      <p>The website may use <strong>browser local storage</strong> to remember accessibility and display preferences you select.</p>
      <ul>
        <li>colour theme</li>
        <li>font preference</li>
        <li>text size</li>
        <li>text spacing</li>
        <li>other accessibility display settings</li>
      </ul>
      <p>These preferences remain on your own device and are not sent to the researcher for research, analytics, advertising or profiling purposes.</p>
      <p>You can change or reset these preferences at any time using the accessibility controls or by clearing the website data stored in your browser.</p>
      <p>Text-to-Speech playback is not used to track visitors and does not automatically continue when you move to another page or return during a later visit.</p>
    </section>
    <section>
      <h2>4. Third-Party Content</h2>
      <p>The website may link to or display content provided by third-party services, including, where used:</p>
      <ul>
        <li>YouTube</li>
        <li>Google Fonts</li>
        <li>university websites</li>
        <li>Microsoft Forms</li>
        <li>Google Forms</li>
        <li>other research, participation or academic resources</li>
      </ul>
      <p>When you access third-party content or services, the provider may process technical information or use its own cookies or similar technologies.</p>
      <p>These services operate independently of this website and are governed by their own privacy and data-protection practices.</p>
      <p>The researcher does not control how third-party services process information once you access those services.</p>
    </section>
    <section>
      <h2>5. GitHub Pages Hosting</h2>
      <p>This website is hosted using <strong>GitHub Pages</strong>, a service provided by GitHub.</p>
      <p>When a GitHub Pages website is visited, GitHub logs and stores the visitor's IP address for security purposes.</p>
      <p>This processing is carried out by GitHub as the hosting provider rather than by the researcher.</p>
      <p>The researcher does not use this information to identify visitors and does not use GitHub Pages visitor information for research, website analytics, advertising, profiling or behavioural monitoring.</p>
      <p>No third-party analytics service, advertising network or behavioural tracking system has been intentionally added to this website.</p>
      <p>More information about GitHub's handling of information is available through GitHub's own Privacy Statement.</p>
    </section>
    <section>
      <h2>6. Research Participation and Research Data</h2>
      <p>Simply visiting this website does <strong>not</strong> make you a research participant.</p>
      <p>Research participation only begins through the separate participation and informed-consent process described for the relevant research activity.</p>
      <p>Personal information collected as part of the research project is managed separately from ordinary use of this website.</p>
      <p>Research data will be handled in accordance with:</p>
      <ul>
        <li>the project's approved research ethics arrangements</li>
        <li>applicable data-protection legislation</li>
        <li>relevant Falmouth University and UAL requirements</li>
        <li>the information provided to participants before taking part</li>
      </ul>
      <p>For research conducted in the United Kingdom, applicable requirements include the <strong>UK General Data Protection Regulation (UK GDPR)</strong> and the <strong>Data Protection Act 2018</strong>, as amended.</p>
      <p>Research conducted in Canada or Hong Kong will additionally follow applicable local legal, ethical and host-institutional requirements.</p>
      <p>Research information will be stored securely and retained in accordance with the approved research protocol, institutional requirements and applicable law.</p>
      <p>More specific information about the collection, use, storage, confidentiality and retention of research data will be provided in the relevant <strong>Participant Information Sheet</strong> before participation.</p>
    </section>
    <section>
      <h2>7. Research Participation and Withdrawal</h2>
      <p>Taking part in the research is voluntary.</p>
      <p>Research participants may pause or withdraw from participation in accordance with the arrangements explained in the relevant Participant Information Sheet and consent materials.</p>
      <p>Participants will be informed before taking part about:</p>
      <ul>
        <li>how to withdraw</li>
        <li>the period during which withdrawal is possible</li>
        <li>what will happen to information already collected</li>
        <li>any circumstances in which information can no longer reasonably be removed from the research</li>
      </ul>
      <p>Withdrawing from a research activity is separate from exercising rights under data-protection law.</p>
      <p>You do not need to provide a reason for withdrawing from research participation unless you choose to do so.</p>
    </section>
    <section>
      <h2>8. Your Data-Protection Rights</h2>
      <p>Depending on the circumstances and the law that applies, you may have rights concerning personal information held about you.</p>
      <p>These may include rights to:</p>
      <ul>
        <li>request access to your personal information</li>
        <li>request correction of inaccurate information</li>
        <li>request erasure in certain circumstances</li>
        <li>request restriction of processing in certain circumstances</li>
        <li>object to certain forms of processing</li>
        <li>raise a concern or complaint with the relevant data-protection authority</li>
      </ul>
      <p>Some rights may operate differently where personal data is processed for research purposes or where an applicable research exemption applies.</p>
      <p>Exercising a data-protection right will not affect your academic standing, access to university services or decision about whether to participate in the research.</p>
    </section>
    <section>
      <h2>9. Security</h2>
      <p>Reasonable technical and organisational measures are used to protect personal information collected directly for the research project.</p>
      <p>Research information is stored using approved secure systems and access is restricted according to the project's research and data-management arrangements.</p>
      <p>Please be aware that no method of transmitting information over the internet can be guaranteed to be completely secure.</p>
      <p>You should not send highly sensitive or confidential information through a general website contact form unless specifically requested to do so through an approved research process.</p>
    </section>
    <section>
      <h2>10. Contact</h2>
      <p>If you have questions about this Privacy Notice, the website, or how information may be handled in relation to the BITS research project, you can contact the researcher using the <a href="/contact/">Contact</a> page on this website.</p>
      <p>For questions specifically concerning participation in a research activity, please use the contact information provided in the relevant Participant Information Sheet.</p>
    </section>
    <section>
      <h2>11. Changes to This Privacy Notice</h2>
      <p>This Privacy Notice may be updated where necessary to reflect:</p>
      <ul>
        <li>changes to the website or its technical services</li>
        <li>changes to the research project</li>
        <li>amendments approved through the research ethics process</li>
        <li>changes to institutional requirements</li>
        <li>changes to applicable legal or data-protection requirements</li>
      </ul>
      <p>The latest revision date will always be displayed at the top of this page.</p>
      <p>Changes to this Privacy Notice do not override the information or consent arrangements already provided to research participants. Where a material change affects an approved research activity or the handling of participant information, the appropriate institutional and ethical review processes will be followed before that change is implemented.</p>
    </section>
  `,
  '/terms-of-use/': `
    <section>
      <h1>Terms of Use</h1>
      <h2>Research Use Statement</h2>
      <p>This website is provided for research communication and educational purposes in connection with a doctoral research project co-registered at the University of the Arts London (UAL) and Falmouth University.</p>
      <p>Use of this website does not require participation in the research project.</p>
      <p>If you choose to register for a research activity, participation is entirely voluntary and subject to the Participant Information Sheet and consent procedures provided during the registration process.</p>
    </section>
    <section>
      <h2>Intellectual Property &amp; Licence</h2>
      <p>Unless otherwise stated, original text, images, and materials on this website are © Charlie Tak Hei Kwong 鄺德希 / Building Identity Through Stories Research Project and are licensed under the <a href="https://creativecommons.org/licenses/by-nc/4.0/deed.en">Creative Commons Attribution-NonCommercial 4.0 International Licence (CC BY-NC 4.0)</a>.</p>
      <p>Some visual materials on this website are constructed representations created to communicate the themes, atmosphere, and pedagogical context of the research project. These images are illustrative rather than documentary and do not depict actual participants or research sessions.</p>
      <p>This licence does not apply to third-party content, participant creative work, or institutional logos or trademarks.</p>
    </section>
    <section>
      <h2>Third-Party Content and Links</h2>
      <p>This website may contain links to or embedded content from third-party platforms. These services operate under their own terms, privacy policies, and cookie practices.</p>
    </section>
    <section>
      <h2>Disclaimer</h2>
      <p>The content provided on this website is intended for research dissemination and general informational purposes only. It does not constitute medical, therapeutic, legal, or professional advice.</p>
      <p>While reasonable care is taken to ensure that the information presented is accurate and up to date, no warranty or guarantee is given regarding completeness, reliability, or suitability for any particular purpose.</p>
    </section>
    <section>
      <h2>Changes to These Terms</h2>
      <p>These Terms of Use may be updated from time to time to reflect changes in the research project, legal requirements, or institutional policies.</p>
    </section>
  `,
  '/thank-you-prize-terms/': `
    <section>
      <h1>Thank-you Prize Terms and Conditions</h1>
      <p><strong>Last updated:</strong> 24 August 2026</p>
      <p><strong>Research ethics reference:</strong> RIEC 25-222</p>
      <p>BITS offers an optional prize draw as a small thank-you to students who give their time to the research.</p>
      <p>These terms explain how the prize draw works for each eligible BITS session.</p>
    </section>
    <section>
      <h2>Who can enter?</h2>
      <p>Students taking part in an eligible <strong>BITS workshop or online research session</strong> can choose to enter that session's prize draw.</p>
      <p>Entering is free and completely optional. You can still take part in BITS if you do not want to enter the draw.</p>
    </section>
    <section>
      <h2>What can I win?</h2>
      <p>Each prize is a <strong>local grocery gift card worth up to £10</strong>.</p>
      <p>The number of prizes available for each session will be clearly shown before that session takes place.</p>
    </section>
    <section>
      <h2>How do I enter?</h2>
      <p>If you take part in an eligible BITS session, you will be given the option to enter that session's prize draw.</p>
      <p>You can enter <strong>once per eligible session</strong>.</p>
      <p>Entering the draw is separate from your research responses.</p>
      <p>You do <strong>not</strong> need to stay until the end of a session to enter or to be included in the draw.</p>
    </section>
    <section>
      <h2>Do I need to complete everything to enter?</h2>
      <p>No.</p>
      <p>Your chance of winning does not depend on how much of the activity you complete, how long your answers are, what you create, or how much personal information you choose to share.</p>
      <p>You can skip a question or activity, take a break or leave early without reducing your chance of winning.</p>
    </section>
    <section>
      <h2>How are winners chosen?</h2>
      <p>Winners will be selected <strong>at random</strong> from all eligible entries for that session.</p>
      <p>Each eligible entry has the same chance of being selected.</p>
      <p>Your chance of winning will depend on the number of eligible entries and the number of prizes available for that session.</p>
    </section>
    <section>
      <h2>When will the draw take place?</h2>
      <p>The <strong>number of prizes and closing time</strong> will be shown for each eligible session.</p>
      <p>The draw will close at the stated time. Winners will then be selected at random and contacted privately.</p>
      <p>You do <strong>not</strong> need to stay until the end of the session or be present when winners are selected.</p>
    </section>
    <section>
      <h2>What happens if I win?</h2>
      <p>You will be contacted <strong>privately</strong> using the contact details you provided for the prize draw.</p>
      <p>If a winner does not respond within <strong>14 days</strong>, another eligible entry may be selected at random.</p>
      <p>Prizes cannot be exchanged for cash.</p>
    </section>
    <section>
      <h2>Does entering affect my research participation?</h2>
      <p>No.</p>
      <p>Choosing to enter — or not to enter — will not affect your participation in BITS, your studies, university support, or your relationship with Falmouth University.</p>
      <p>The prize draw is a small thank-you. It is <strong>not based on what you say, create or choose to share</strong> during the research.</p>
    </section>
    <section>
      <h2>How will my information be used?</h2>
      <p>Contact information provided for the prize draw will only be used to <strong>administer the draw and contact winners</strong>.</p>
      <p>Prize draw information will be kept separate from your research responses.</p>
    </section>
    <section>
      <h2>What about the workshop journal?</h2>
      <p>Some students using the written workshop activity may receive a small journal worth up to <strong>£2</strong>.</p>
      <p>The journal is part of the workshop activity and is separate from the prize draw.</p>
    </section>
    <section>
      <h2>Can these terms change?</h2>
      <p>Yes. These terms may be updated if the research or prize draw arrangements change.</p>
      <p>BITS intends to continue offering a <strong>thank-you prize</strong> for eligible sessions. The type or value of the prize may change in the future.</p>
      <p>Any change that affects the approved research arrangements will be reviewed through the appropriate <strong>Falmouth University research ethics process before it is introduced</strong>.</p>
      <p>If these terms change, the updated information will be published on this page with a new <strong>Last updated</strong> date.</p>
      <p>Changes will not be applied retrospectively to a prize draw that has already opened. The prize information shown when you enter a draw will continue to apply to that draw.</p>
    </section>
    <section>
      <h2>Questions?</h2>
      <p>If you have a question about the prize draw, please contact <strong>Charlie Kwong</strong> through the BITS contact page.</p>
      <p>You can ask a question before deciding whether you want to take part.</p>
      <p><a href="/contact/">Contact BITS</a></p>
    </section>
    <section>
      <h2>About the research</h2>
      <p>BITS is a doctoral research project at <strong>Falmouth University</strong>.</p>
      <p>The research has received ethical approval from Falmouth University's Research Integrity &amp; Ethics Committee (<strong>RIEC 25-222</strong>).</p>
      <p>Taking part in the prize draw is optional and separate from deciding whether to take part in the research.</p>
    </section>
  `,
  '/accessibility/': `
    <section>
      <h1>Accessibility</h1>
      <h2>Commitment to Accessibility</h2>
      <p>Building Identity Through Stories is committed to providing a website that is accessible to as many people as possible. The website is designed and developed with reference to the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA.</p>
      <p>Accessibility is considered in the underlying page structure and interaction design, rather than relying only on optional accessibility tools.</p>
    </section>
    <section>
      <h2>How Accessible This Website Is</h2>
      <p>The website includes keyboard-accessible navigation, visible focus indicators, colour-contrast checks, responsive text and page reflow, semantic headings and landmarks, skip navigation, accessible forms, reduced-motion support, and appropriate alternative text for images.</p>
      <p>Verdana is used as the default reading font. Visitors can switch to Atkinson Hyperlegible, increase text size, adjust text spacing, use light or dark display modes, and start optional Text-to-Speech.</p>
      <p>Font, text-size, text-spacing, and colour-theme preferences are remembered in the visitor's browser on that device. These preferences are stored locally and are not sent to the researcher. Text-to-Speech playback is not remembered or started automatically.</p>
    </section>
    <section>
      <h2>External and Third-Party Content</h2>
      <p>Some research information, event details, videos, or other resources may be provided through university or third-party platforms. The accessibility of these external services is managed by the organisations that provide them and may be outside the direct control of this website.</p>
      <p>Where possible, an accessible alternative or additional information will be considered if external content creates a barrier to access.</p>
    </section>
    <section>
      <h2>Feedback and Contact</h2>
      <p>If you experience difficulty accessing any part of this website, or require information in an alternative format, please contact Charlie Tak Hei Kwong 鄺德希 through the <a href="/contact/">contact page</a>.</p>
      <p>Reasonable efforts will be made to respond to accessibility requests within 14 days.</p>
    </section>
    <section>
      <h2>Technical Information and Testing</h2>
      <p>This website is developed with reference to WCAG 2.2 Level AA. Testing uses a combination of code review, automated accessibility checks, and manual testing. A formal claim of full WCAG 2.2 AA conformance will only be made after final assistive-technology and browser testing has been completed.</p>
    </section>
    <section>
      <h2>Preparation of This Statement</h2>
      <p>This statement was last reviewed in August 2026. It will be reviewed following substantial changes to the website, and accessibility testing will continue as new content and features are introduced.</p>
    </section>
  `,
  '/research-ethics/': `
    <section>
      <h1>Research Ethics</h1>
      <p>This research is developed with the commitment to ethical and caring practice and has received formal approval from the Research Integrity and Ethics Committee (Ref: RIEC 25-222).</p>
      <p>We believe in a person-centered practice: participation is entirely voluntary, and you are welcome to choose how you engage with the activities. Your comfort and privacy are our priorities. All information shared is treated with strict confidentiality and managed in line with applicable data protection requirements.</p>
      <p>You retain full control over your participation and may withdraw from the research at any time without any need for explanation.</p>
      <p>Further information about the project's research ethics and data protection procedures can be found here:</p>
      <p><a href="https://charliekwong.myblog.arts.ac.uk/doctoral-research/research-ethics/">Read the Full Research Ethics</a></p>
    </section>
  `,
  '/404.html': `
    <section>
      <h1>Page Not Found</h1>
      <p>This page could not be found on the BITS doctoral research website.</p>
      <p>Choose where you would like to go next.</p>
      <ul>
        <li><a href="/">Return Home</a></li>
        <li><a href="/get-involved/">Get Involved</a></li>
        <li><a href="/contact/">Contact Us</a></li>
      </ul>
    </section>
  `,
};

const SITE_ORIGIN = 'https://bitsresearch.github.io';
const routeFiles = [
  ['/', 'index.html'],
  ['/about/', 'about/index.html'],
  ['/people/', 'people/index.html'],
  ['/what-we-care/', 'what-we-care/index.html'],
  ['/research-update/', 'research-update/index.html'],
  ['/output-resources/', 'output-resources/index.html'],
  ['/get-involved/', 'get-involved/index.html'],
  ['/contact/', 'contact/index.html'],
  ['/privacy-policy/', 'privacy-policy/index.html'],
  ['/terms-of-use/', 'terms-of-use/index.html'],
  ['/accessibility/', 'accessibility/index.html'],
  ['/research-ethics/', 'research-ethics/index.html'],
  ['/thank-you-prize-terms/', 'thank-you-prize-terms/index.html'],
  ['/404.html', '404.html'],
];

const linkPrefix = (file) => {
  const depth = file.split('/').length - 1;
  return depth === 0 ? '' : '../'.repeat(depth);
};

const absolutizeLocalLinks = (html, prefix) => {
  const localPrefix = prefix || './';
  return html.replace(/(href|src)="\/(?!\/)/g, `$1="${localPrefix}`);
};

const buildFallback = (route, file) => {
  const prefix = linkPrefix(file);
  const mainNav = [...nav, ...legalNav]
    .map(([href, label]) => `<li><a href="${href}">${label}</a></li>`)
    .join('');
  const content = pageContent[route];
  return absolutizeLocalLinks(`
      <div id="root">
        <!-- BEGIN_STATIC_SEO_CONTENT -->
        <a class="sr-only" href="#content">Skip to content</a>
        <header role="banner">
          <nav aria-label="Main navigation">
            <ul>${mainNav}</ul>
          </nav>
        </header>
        <main id="content" role="main">
          ${content}
        </main>
        <!-- END_STATIC_SEO_CONTENT -->
      </div>`, prefix);
};

for (const [route, file] of routeFiles) {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) continue;
  const html = fs.readFileSync(filePath, 'utf8');
  const fallback = buildFallback(route, file);
  const next = html
    .replace(/<div id="root"><\/div>/, fallback)
    .replace(/<div id="root">\s*<!-- BEGIN_STATIC_SEO_CONTENT -->[\s\S]*?<!-- END_STATIC_SEO_CONTENT -->\s*<\/div>/, fallback)
    .replace(/<div id="root">[\s\S]*?<\/div>(\s*<script type="module")/, `${fallback}$1`);
  fs.writeFileSync(filePath, next);
}

const redirectHtml = (target, canonical, label) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, follow"><link rel="canonical" href="${canonical}">
<meta http-equiv="refresh" content="0; url=${target}"><title>Redirecting | Building Identity through Stories</title>
<script>window.location.replace(${JSON.stringify(target)});</script></head>
<body><p>Redirecting to <a href="${target}">${label}</a>.</p></body></html>`;

// These are the preferred, indexable navigation pages. Do not generate
// duplicate .html aliases for them: stale aliases previously exposed a
// `noindex` meta tag and produced misleading Search Console exclusions.
// GitHub Pages serves each page from its canonical trailing-slash URL.
const indexableNavigationSlugs = new Set([
  'about',
  'what-we-care',
  'people',
  'output-resources',
  'get-involved',
  'contact',
]);

const redirects = [
  ...['about','people','what-we-care','research-update','output-resources','get-involved','contact','privacy-policy','terms-of-use','accessibility','research-ethics','thank-you-prize-terms']
    .filter(slug => !indexableNavigationSlugs.has(slug))
    .map(slug => [`${slug}.html`, `/${slug}/`, `${SITE_ORIGIN}/${slug}/`, slug.replaceAll('-', ' ')]),
  ['upcomingworkshops.html', '/#upcoming-workshops', `${SITE_ORIGIN}/`, 'the Upcoming Workshops section'],
  ['upcomingworkshops/index.html', '/#upcoming-workshops', `${SITE_ORIGIN}/`, 'the Upcoming Workshops section'],
  ['upcomingworkshop.html', '/#upcoming-workshops', `${SITE_ORIGIN}/`, 'the Upcoming Workshops section'],
  ['upcomingworkshop/index.html', '/#upcoming-workshops', `${SITE_ORIGIN}/`, 'the Upcoming Workshops section'],
  ['team.html', '/people/', `${SITE_ORIGIN}/people/`, 'People'],
  ['team/index.html', '/people/', `${SITE_ORIGIN}/people/`, 'People'],
];

for (const [file, target, canonical, label] of redirects) {
  const filePath = path.join(rootDir, file);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, redirectHtml(target, canonical, label));
}

// Blog posts are part of the React application and therefore use the same
// Layout.tsx header, footer, accessibility controls, and navigation as every
// other page. This generator only creates route-specific static HTML entry
// points for GitHub Pages/SEO; React replaces the fallback after hydration.
const blogDataPath = path.resolve(__dirname, '..', 'content', 'blog-posts.json');
if (fs.existsSync(blogDataPath)) {
  const blogPosts = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'));
  const appEntryPath = path.join(rootDir, 'index.html');
  const appEntryHtml = fs.existsSync(appEntryPath) ? fs.readFileSync(appEntryPath, 'utf8') : '';

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

  const buildBlogFallback = (post, file) => {
    const prefix = linkPrefix(file);
    const mainNav = [...nav, ...legalNav]
      .map(([href, label]) => `<li><a href="${href}">${label}</a></li>`)
      .join('');
    const image = post.image ? `<figure><img src="${post.image}" alt="${escapeHtml(post.imageAlt)}">${post.caption ? `<figcaption>${escapeHtml(post.caption)}</figcaption>` : ''}</figure>` : '';
    return absolutizeLocalLinks(`
      <div id="root">
        <!-- BEGIN_STATIC_SEO_CONTENT -->
        <a class="sr-only" href="#content">Skip to content</a>
        <header role="banner"><nav aria-label="Main navigation"><ul>${mainNav}</ul></nav></header>
        <main id="content" role="main">
          <article>
            <header>
              <p class="text-sm md:text-base font-bold uppercase tracking-[0.16em] text-sage-700 dark:text-sage-300 mb-4">${escapeHtml(post.category)}</p>
              <h1>${escapeHtml(post.title)}</h1>
              <p>${escapeHtml(post.standfirst)}</p>
              <p>By <a href="/people/">Charlie Tak Hei Kwong 鄺德希</a> · <time datetime="${escapeHtml(post.dateISO)}">${escapeHtml(post.dateText)}</time></p>
            </header>
            ${image}
            <div class="blog-prose">${post.bodyHtml}</div>
          </article>
        </main>
        <!-- END_STATIC_SEO_CONTENT -->
      </div>`, prefix);
  };

  for (const post of blogPosts) {
    const file = `blog/${post.slug}/index.html`;
    const filePath = path.join(rootDir, file);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const canonicalUrl = `${SITE_ORIGIN}/blog/${post.slug}/`;
    const fallback = buildBlogFallback(post, file);
    // Blog entry pages sit two directories below the site root. Rebase Vite's
    // relative asset URLs and replace the existing static fallback before
    // writing post-specific SEO content.
    let html = appEntryHtml.replaceAll('"./assets/', '"../../assets/');
    html = html
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(post.seoTitle || post.title)} | BITS</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/?\>/, `<meta name="description" content="${escapeHtml(post.description)}" />`)
      .replace(/<link rel="canonical" href="[^"]*"\s*\/?\>/, `<link rel="canonical" href="${canonicalUrl}" />`)
      .replace(/<meta property="og:type" content="[^"]*"\s*\/?\>/, '<meta property="og:type" content="article" />')
      .replace(/<meta property="og:title" content="[^"]*"\s*\/?\>/, `<meta property="og:title" content="${escapeHtml(post.title)}" />`)
      .replace(/<meta property="og:description" content="[^"]*"\s*\/?\>/, `<meta property="og:description" content="${escapeHtml(post.description)}" />`)
      .replace(/<meta property="og:url" content="[^"]*"\s*\/?\>/, `<meta property="og:url" content="${canonicalUrl}" />`)
      .replace(/<meta property="og:image" content="[^"]*"\s*\/?\>/, `<meta property="og:image" content="${post.image ? SITE_ORIGIN + post.image : `${SITE_ORIGIN}/images/og-image.jpg`}" />`)
      .replace(/<meta name="twitter:title" content="[^"]*"\s*\/?\>/, `<meta name="twitter:title" content="${escapeHtml(post.title)}" />`)
      .replace(/<meta name="twitter:description" content="[^"]*"\s*\/?\>/, `<meta name="twitter:description" content="${escapeHtml(post.description)}" />`)
      .replace(/<div id="root">\s*<!-- BEGIN_STATIC_SEO_CONTENT -->[\s\S]*?<!-- END_STATIC_SEO_CONTENT -->\s*<\/div>/, fallback)
      .replace(/<div id="root"><\/div>/, fallback);
    fs.writeFileSync(filePath, html);
  }

  // Preserve the old accommodation URL as a redirect to its canonical slug.
  const oldAccommodation = path.join(rootDir, 'blog', 'finding-private-accommodation-falmouth-penryn', 'index.html');
  fs.mkdirSync(path.dirname(oldAccommodation), { recursive: true });
  fs.writeFileSync(oldAccommodation, redirectHtml(
    '/blog/finding-private-accommodation-falmouth-penryn-neurodivergent-guide/',
    `${SITE_ORIGIN}/blog/finding-private-accommodation-falmouth-penryn-neurodivergent-guide/`,
    'the private accommodation guide'
  ));

  const oldMapPost = path.join(rootDir, 'blog', 'falmouth-university-map-2026-new-students', 'index.html');
  fs.mkdirSync(path.dirname(oldMapPost), { recursive: true });
  fs.writeFileSync(oldMapPost, redirectHtml(
    '/blog/falmouth-university-map-2026/',
    `${SITE_ORIGIN}/blog/falmouth-university-map-2026/`,
    'the Falmouth and Penryn community map'
  ));
}
