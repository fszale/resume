#import "../common.typ": *
#set page(paper: "us-letter", margin: (top: 0.5in, bottom: 0.5in, left: 0.56in, right: 0.56in))
#set text(font: "Libertinus Serif", size: 9.4pt, fill: palette.ink)
#set par(justify: true, leading: 0.76em)
#set list(spacing: 0.38em)

#header("Filip Szalewicz", "Principal Engineer / Fractional CTO | Agentic AI, Digital Twins, Multi-Agent Systems", [Macomb, MI | Open to Remote Work | linkedin.com/in/fszalewicz | fszale\@gmail.com | github.com/fszale | solidcage.com])

#section("Summary", [
  Principal engineer and Fractional CTO with 20+ years of experience building SaaS platforms, data systems, AI products, and cloud infrastructure. Current focus is agentic-first transformation: designing digital twins, multi-agent systems, and Agentic OS patterns that help organizations adopt AI directly inside active delivery workflows. Partner with executive leadership, technical leaders, and engineering teams to train AI best practices, implement governance and human-in-the-loop controls, and accelerate measurable outcomes across product and operations. Recent work includes organizational transformation for a 150-person technology company, agent-powered SaaS for data analysis and lead intelligence, and delivery acceleration such as compressing the timeline for vizly.ai from 9 months to 3 months.
])

#section("Core Competencies", [
  #skill_grid((
    [Agentic AI Strategy & Transformation - AI adoption strategy, operating models, organizational change, delivery acceleration],
    [Digital Twins & Multi-Agent Systems - twin design, agent factories, agent orchestration, context design, workflow decomposition],
    [Agentic OS & Workflow Automation - ecommerce and business workflow automation, human-in-the-loop approvals, guardrails, self-improvement loops],
    [Agent-Powered SaaS & Data Products - AI-assisted analytics, exploration, lead intelligence, signal enrichment],
    [AI Governance & Evaluation - approval flows, auditability, guardrails, feedback loops, measurable outcomes],
    [Cloud Runtime Engineering - Python, FastAPI, Node.js, Next.js, Supabase, Docker, Kubernetes, Cloud Run, AWS, GCP, Azure],
  ))
])

#section("Professional Experience", [
  #role(
    "Solid Cage Inc",
    "Macomb, MI",
    "Principal Consultant, Fractional CTO & SaaS Founder",
    "2009 - Present",
    (
      [Lead agentic-first transformation programs for multiple clients, including a 150-person technology company, partnering with executive leadership, technical leaders, and engineering staff to accelerate AI adoption across the organization.],
      [Train leaders and delivery teams on practical AI best practices, workflow redesign, and operating models that embed AI directly into projects already in flight instead of isolated experiments.],
      [Drive development and adoption of digital twins in preparation for agent factory deployment, defining roles, context, guardrails, and governance patterns for production use.],
      [Architect Agentic OS patterns for end-to-end ecommerce workflow automation using human-in-the-loop approvals, guardrails, structured context, and self-improvement loops.],
      [Work as a change agent across multiple businesses, helping teams rapidly adopt AI in ways that increase throughput, compress delivery cycles, and create visible product outcomes.],
      [Founded and scaled consultancy delivering 50+ SaaS, data, and analytics solutions with 95%+ client retention.],
    ),
  )

  #role(
    "Shoptelligence",
    "Ann Arbor, MI",
    "Vice President of Engineering",
    "2022 - 2025",
    (
      [Architected a 15+ TB data lake and warehouse platform, reducing analytics retrieval from 3+ weeks to 1 day.],
      [Built ETL pipelines with Airflow, Spark, Data Fusion, and BigQuery, boosting integration speed by 75% and supporting \$1M+ ARR growth.],
      [Established data quality standards and CI/CD practices that reduced support tickets by 500%.],
    ),
  )

  #role(
    "Rocket Mortgage (Quicken Loans)",
    "Detroit, MI",
    "Principal Engineer / Team Lead, Data Science",
    "2017 - 2021",
    (
      [Architected a petabyte-scale data lake and ELT platform using AWS Glue, Spark, and Cloudera, reducing annual cost by more than \$1M.],
      [Led enterprise data fabric and MDM integrations that improved compliance and increased loan volume by 10%+.],
      [Operationalized ML platforms on AWS using SageMaker, Lambda, and Athena for fraud detection and risk modeling.],
    ),
  )
  #compact-role([West Monroe Partners - Senior Architect (2021 - 2022)])
  #compact-role([360ofme Inc - CTO / Principal Engineer (2016 - 2017)])
  #compact-role([Earlier Roles: Healthcare SaaS, secure payments, enterprise reporting, integration frameworks, ERP, and industrial systems.])
])

#section("Selected Public Agentic AI Work", [
  #set list(marker: [#text(fill: palette.accent)[-]])
  #list(
    [agent-kernel - Reusable digital twin knowledge layer with agent skills, prompts, templates, diagrams, and automation for consistent execution.],
    [agent-factory - FastAPI runtime for hosting digital twins with model routing, Supabase-backed persistence, admin governance, and Cloud Run deployment patterns.],
    [agentic-playbook - Role-based adoption layer for engineers, architects, executives, compliance leaders, and power users implementing agentic AI.],
    [operational-intelligence-lab - Open methodology connecting AI implementation to rate-of-improvement, ROI modeling, training, and business deployment.],
  )
])

#section("Education, Certifications, and Public Links", [
  #set list(marker: [#text(fill: palette.accent)[-]])
  #list(
    [Education: Oakland Community College - Associate's in Computer Information Systems; University of Phoenix - Information Systems Management coursework],
    [Certifications: AWS Certified Developer - Associate (2018); AWS Certified Solutions Architect - Associate (2018); Microsoft Certified Professional: Requirements & Solution Architecture (2000)],
    [Public: GitHub: https://github.com/fszale | LinkedIn: https://www.linkedin.com/in/fszalewicz/ | YouTube: https://www.youtube.com/\@Control-The-Outcome | Solid Cage: https://www.solidcage.com],
  )
])
