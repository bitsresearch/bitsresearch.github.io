import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.resolve(__dirname, '..');

const nav = [
  ['/', 'Home'],
  ['/about/', 'About'],
  ['/what-we-care/', 'What We Care About'],
  ['/team/', 'People'],
  ['/output-resources/', 'Output'],
  ['/get-involved/', 'Get Involved'],
  ['/contact/', 'Contact'],
];

const legalNav = [
  ['/privacy-policy/', 'Privacy Policy'],
  ['/terms-of-use/', 'Terms of Use'],
  ['/accessibility/', 'Accessibility'],
  ['/research-ethics/', 'Research Ethics'],
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
      <img src="http://charliekwong.myblog.arts.ac.uk/files/2026/03/Transmedia-Storytelling-Workshop.png" alt="Diagram showing the research framework of the BITS project." />
    </section>
    <section>
      <h2>Ethical Approval</h2>
      <p>This research project has been reviewed and approved by the institutional ethics committee. All procedures meet the required ethical standards.</p>
      <p><a href="/get-involved/">Get Involved!</a></p>
    </section>
  `,
  '/team/': `
    <section>
      <h1>Team</h1>
      <p>Researcher, Supervisors &amp; Advisors</p>
      <h2>Charlie Tak Hei Kwong 鄺德希</h2>
      <p>Doctoral Researcher</p>
      <p>Charlie is a doctoral researcher and registered teacher passionate about the intersection of creative media and inclusive education. His fully funded research explores how transmedia storytelling can create supportive spaces for students with diverse needs as they navigate their journey into higher education.</p>
      <p><a href="https://thkwong.uk">Website</a></p>
      <p><a href="mailto:c.kwong1220251@arts.ac.uk,tk290331@falmouth.ac.uk">Email</a></p>
      <img src="https://journal.falmouth.ac.uk/transitmedia/files/2025/11/profilepic.jpg" alt="Charlie Tak Hei Kwong" />
    </section>
    <section>
      <h2>Experience and Research Focus</h2>
      <p>Charlie's journey began as a school teacher in Hong Kong. Between his early research assistantships in education, and his time living in Hong Kong, Canada, UK, and the Netherlands, he developed an interest in the way people learn and handle the move into new chapters of their lives.</p>
      <p>After spending over eight years shaping blended learning and academic projects, Charlie has turned his focus toward making higher education more inclusive. These days, he's exploring how arts-based research and creative practice can empower and support people with diverse backgrounds.</p>
    </section>
    <section>
      <h2>Doctoral Research Supervision</h2>
      <p>This research is developed under the guidance of an interdisciplinary supervisory team:</p>
      <ul><li>Dr Jennifer Young, Director of Studies, Dean, Faculty of Business &amp; Design</li><li>Prof. Neil Fox, Professor of Film Practice and Pedagogy</li><li>Prof. Russell Crawford, Deputy Vice-Chancellor (Interim)</li></ul>
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
      <p><a href="https://charliekwong.myblog.arts.ac.uk/2026/02/01/upcoming-workshop/">Learn More</a></p>
      <p><a href="https://forms.office.com/e/FPSgmUxEhD">Register Interest</a></p>
      <h2>Collaborate as a Community Advisor</h2>
      <p>Join us as a Community Advisor [Remote/On-site] and help shape workshop design, delivery, safeguarding, and ethical practice to better support students in transition!</p>
      <p><a href="https://charliekwong.myblog.arts.ac.uk/2026/02/01/community-advisors-wanted-supporting-identity-transition-in-higher-education/">Learn More</a></p>
      <p><a href="/contact/">Get in Touch</a></p>
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
      <h1>Privacy Policy</h1>
      <p>Revision Date: 11 March 2026</p>
      <p>This website is maintained by Charlie Tak Hei Kwong, a doctoral researcher registered with the University of the Arts London (UAL) and Falmouth University. The website is used for academic communication and research dissemination purposes only.</p>
      <p>This site is a static website hosted on GitHub and deployed via Netlify.</p>
      <p>The website itself does not use analytics, tracking scripts, or advertising technologies.</p>
    </section>
    <section>
      <h2>1. Information You May Provide</h2>
      <p>Visitors may voluntarily provide personal information (for example, name, email address, or information about learning experiences) through external contact or participation forms, such as Microsoft Forms or Google Forms.</p>
      <p>Any information provided will be used only for the specific purpose stated at the point of collection, such as communication regarding the research project, participation in workshops or studies, and providing feedback about the project.</p>
      <p>Personal information collected for research purposes will not be shared with third parties, except the supervisory team and research degree committees at Falmouth University and the University of the Arts London, where required by law, or where participants have provided explicit consent.</p>
      <p>Where external services such as Microsoft Forms or Google Forms are used, personal data may be processed and stored by those providers in accordance with their respective privacy policies and data protection practices.</p>
    </section>
    <section>
      <h2>2. Third-Party Content and Services</h2>
      <p>This website may contain links to, or embedded content from, third-party platforms such as YouTube, university webpages, and external participation or contact forms.</p>
      <p>These third-party services may use their own cookies, tracking technologies, or data processing systems which are outside the control of this website.</p>
    </section>
    <section>
      <h2>3. Hosting and Infrastructure</h2>
      <p>The website is hosted through Netlify, which may generate limited server logs for security and operational purposes. These logs are managed by the hosting provider and are not used by the researcher for tracking or profiling visitors.</p>
    </section>
    <section>
      <h2>4. Data Protection and Legal Compliance</h2>
      <p>Research data collected through this project will be handled in accordance with relevant data protection laws, including UK GDPR, Data Protection Act 2018 (UK), PIPEDA in Canada, and the Personal Data (Privacy) Ordinance in Hong Kong.</p>
    </section>
    <section>
      <h2>5. Your Rights</h2>
      <p>Depending on your jurisdiction, you may have the right to request access, correction, or deletion of personal data, withdraw consent for participation, or lodge a complaint with your relevant data protection authority.</p>
    </section>
    <section>
      <h2>6. Contact</h2>
      <p>If you have any questions about this Privacy Policy or how personal data may be handled in relation to this research project, you may contact the researcher using the <a href="/contact/">contact form</a> provided on this website.</p>
    </section>
    <section>
      <h2>7. Updates</h2>
      <p>This Privacy Policy may be updated from time to time to reflect changes in legal requirements, institutional policies, or the development of the research project.</p>
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
  '/accessibility/': `
    <section>
      <h1>Accessibility</h1>
      <h2>Commitment to Accessibility</h2>
      <p>This website aims to be accessible to as many users as possible. Efforts have been made to design the website in a way that supports a wide range of users, including those with diverse learning needs and accessibility preferences.</p>
      <p>Where possible, the website uses clear language, a simple layout, and readable design to improve usability and accessibility.</p>
    </section>
    <section>
      <h2>Accessibility Features</h2>
      <p>To support accessibility, the site includes features that allow visitors to adjust how content is displayed and read, including dyslexic-friendly fonts, adjustable text spacing, enlarged text, text-to-speech functionality, and light and dark display modes.</p>
    </section>
    <section>
      <h2>Use of External Platforms</h2>
      <p>Some information related to the research activities may be hosted on external institutional platforms. This allows participants to access content through systems that provide established accessibility tools and professional support services.</p>
    </section>
    <section>
      <h2>Third-Party Content</h2>
      <p>This website may also link to external services. Accessibility features on those platforms are managed by the respective service providers and are outside the control of this website.</p>
    </section>
    <section>
      <h2>Feedback and Support</h2>
      <p>If you experience any accessibility difficulties when using this website, you are welcome to contact the researcher through the <a href="/contact/">contact page</a> so that alternative formats or additional support can be considered.</p>
      <p>Reasonable efforts will be made to respond to accessibility requests within 14 days.</p>
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
      <p><a href="/">Return Home</a></p>
    </section>
  `,
};

const aliases = {
  '/upcomingworkshops/': '/',
  '/upcomingworkshop/': '/',
};

const routeFiles = [
  ['/', 'index.html'],
  ['/about/', 'about/index.html'],
  ['/about/', 'about.html'],
  ['/team/', 'team/index.html'],
  ['/team/', 'team.html'],
  ['/what-we-care/', 'what-we-care/index.html'],
  ['/what-we-care/', 'what-we-care.html'],
  ['/research-update/', 'research-update/index.html'],
  ['/research-update/', 'research-update.html'],
  ['/output-resources/', 'output-resources/index.html'],
  ['/output-resources/', 'output-resources.html'],
  ['/get-involved/', 'get-involved/index.html'],
  ['/get-involved/', 'get-involved.html'],
  ['/contact/', 'contact/index.html'],
  ['/contact/', 'contact.html'],
  ['/privacy-policy/', 'privacy-policy/index.html'],
  ['/privacy-policy/', 'privacy-policy.html'],
  ['/terms-of-use/', 'terms-of-use/index.html'],
  ['/terms-of-use/', 'terms-of-use.html'],
  ['/accessibility/', 'accessibility/index.html'],
  ['/accessibility/', 'accessibility.html'],
  ['/research-ethics/', 'research-ethics/index.html'],
  ['/research-ethics/', 'research-ethics.html'],
  ['/upcomingworkshops/', 'upcomingworkshops/index.html'],
  ['/upcomingworkshops/', 'upcomingworkshops.html'],
  ['/upcomingworkshop/', 'upcomingworkshop/index.html'],
  ['/upcomingworkshop/', 'upcomingworkshop.html'],
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
  const contentRoute = aliases[route] || route;
  const prefix = linkPrefix(file);
  const mainNav = [...nav, ...legalNav]
    .map(([href, label]) => `<li><a href="${href}">${label}</a></li>`)
    .join('');
  const content = pageContent[contentRoute];
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
