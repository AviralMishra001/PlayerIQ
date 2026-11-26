"""
Seed skills table with ~50 skills across programming, data, and communication.
Run: python -m scripts.seed_skills
"""
import asyncio
from app.core.database import AsyncSessionLocal
from app.models.skill import Skill, SkillPrerequisite
from sqlalchemy import select

SKILLS = [
    # programming
    ("variables_datatypes", "Variables & Data Types", "programming", "Basic variable declaration and primitive types."),
    ("control_flow", "Control Flow", "programming", "If/else, loops, and branching logic."),
    ("functions", "Functions", "programming", "Defining and calling reusable functions."),
    ("arrays", "Arrays / Lists", "programming", "Array manipulation and common patterns."),
    ("strings", "String Manipulation", "programming", "Common string operations and algorithms."),
    ("recursion", "Recursion", "programming", "Recursive problem solving."),
    ("oops", "Object-Oriented Programming", "programming", "Classes, objects, inheritance, polymorphism."),
    ("data_structures_stack_queue", "Stacks & Queues", "programming", "Linear data structures."),
    ("data_structures_trees", "Trees", "programming", "Binary trees, BSTs, traversals."),
    ("data_structures_graphs", "Graphs", "programming", "Graph representation and traversal."),
    ("hashing", "Hashing", "programming", "Hash maps/sets and use cases."),
    ("sorting_searching", "Sorting & Searching", "programming", "Common sorting and search algorithms."),
    ("time_complexity", "Time Complexity", "programming", "Big-O analysis."),
    ("git_basics", "Git Basics", "programming", "Version control fundamentals."),
    ("sql_basics", "SQL Basics", "programming", "SELECT, WHERE, basic queries."),
    ("sql_joins", "SQL Joins", "programming", "Inner/outer joins, multi-table queries."),
    ("rest_apis", "REST APIs", "programming", "HTTP methods, REST principles, API design."),
    ("http_fundamentals", "HTTP Fundamentals", "programming", "Requests, responses, status codes."),
    ("debugging", "Debugging", "programming", "Systematic bug fixing skills."),
    ("html_css", "HTML & CSS", "programming", "Web page structure and styling."),
    ("javascript_basics", "JavaScript Basics", "programming", "Core JS syntax and DOM."),
    ("react_basics", "React Basics", "programming", "Components, props, state."),
    ("python_basics", "Python Basics", "programming", "Core Python syntax."),
    ("unit_testing", "Unit Testing", "programming", "Writing and running tests."),
    ("api_authentication", "API Authentication", "programming", "Tokens, JWT, OAuth basics."),

    # data
    ("csv_basics", "Working with CSVs", "data", "Reading/writing tabular data."),
    ("data_cleaning", "Data Cleaning", "data", "Handling missing/incorrect data."),
    ("basic_stats", "Basic Statistics", "data", "Mean, median, std dev, distributions."),
    ("visualization", "Data Visualization", "data", "Charts and graphs for insight."),
    ("excel_basics", "Excel / Spreadsheets", "data", "Formulas, pivot tables."),
    ("pandas_basics", "Pandas Basics", "data", "DataFrame operations in Python."),
    ("data_aggregation", "Data Aggregation", "data", "Group-by, summarization."),
    ("hypothesis_testing", "Hypothesis Testing", "data", "Basic statistical inference."),
    ("regression_basics", "Regression Basics", "data", "Linear regression fundamentals."),
    ("dashboarding", "Dashboarding", "data", "Building reporting dashboards."),
    ("data_storytelling", "Data Storytelling", "data", "Communicating insights from data."),
    ("etl_basics", "ETL Basics", "data", "Extract-transform-load fundamentals."),

    # communication
    ("email_writing", "Email Writing", "communication", "Professional email etiquette."),
    ("resume_writing", "Resume Writing", "communication", "Crafting an effective resume."),
    ("interview_basics", "Interview Basics", "communication", "Common interview Q&A prep."),
    ("public_speaking", "Public Speaking", "communication", "Presenting confidently."),
    ("active_listening", "Active Listening", "communication", "Listening and comprehension skills."),
    ("technical_writing", "Technical Writing", "communication", "Clear documentation and reports."),
    ("negotiation_basics", "Negotiation Basics", "communication", "Basic negotiation tactics."),
    ("teamwork", "Teamwork & Collaboration", "communication", "Working effectively in teams."),
    ("feedback_giving", "Giving & Receiving Feedback", "communication", "Constructive feedback skills."),
    ("linkedin_branding", "LinkedIn / Personal Branding", "communication", "Professional online presence."),
    ("cold_outreach", "Cold Outreach", "communication", "Networking and outreach messages."),
    ("pitch_communication", "Pitching Ideas", "communication", "Concisely pitching a concept."),
]

# (skill_name, prerequisite_name)
PREREQUISITES = [
    ("control_flow", "variables_datatypes"),
    ("functions", "control_flow"),
    ("arrays", "functions"),
    ("strings", "arrays"),
    ("recursion", "functions"),
    ("oops", "functions"),
    ("data_structures_stack_queue", "arrays"),
    ("data_structures_trees", "recursion"),
    ("data_structures_graphs", "data_structures_trees"),
    ("hashing", "arrays"),
    ("sorting_searching", "arrays"),
    ("time_complexity", "sorting_searching"),
    ("sql_joins", "sql_basics"),
    ("rest_apis", "http_fundamentals"),
    ("api_authentication", "rest_apis"),
    ("react_basics", "javascript_basics"),
    ("pandas_basics", "python_basics"),
    ("data_cleaning", "csv_basics"),
    ("data_aggregation", "pandas_basics"),
    ("hypothesis_testing", "basic_stats"),
    ("regression_basics", "basic_stats"),
    ("dashboarding", "visualization"),
    ("data_storytelling", "visualization"),
    ("etl_basics", "sql_basics"),
    ("interview_basics", "resume_writing"),
    ("negotiation_basics", "active_listening"),
    ("pitch_communication", "public_speaking"),
]


async def seed():
    async with AsyncSessionLocal() as db:
        name_to_id: dict[str, int] = {}
        for name, display_name, category, description in SKILLS:
            existing = (await db.execute(select(Skill).where(Skill.name == name))).scalar_one_or_none()
            if existing:
                name_to_id[name] = existing.id
                continue
            skill = Skill(name=name, display_name=display_name, category=category, description=description)
            db.add(skill)
            await db.flush()
            name_to_id[name] = skill.id
        await db.commit()
        print(f"Seeded {len(SKILLS)} skills.")

        for skill_name, prereq_name in PREREQUISITES:
            skill_id = name_to_id.get(skill_name)
            prereq_id = name_to_id.get(prereq_name)
            if not skill_id or not prereq_id:
                continue
            existing = (
                await db.execute(
                    select(SkillPrerequisite).where(
                        SkillPrerequisite.skill_id == skill_id,
                        SkillPrerequisite.prereq_skill_id == prereq_id,
                    )
                )
            ).scalar_one_or_none()
            if existing:
                continue
            db.add(SkillPrerequisite(skill_id=skill_id, prereq_skill_id=prereq_id))
        await db.commit()
        print(f"Seeded {len(PREREQUISITES)} prerequisite links.")


if __name__ == "__main__":
    asyncio.run(seed())
