"""
Seed questions + question_skills. Requires seed_skills.py to have run first.
Run: python -m scripts.seed_questions
"""
import asyncio
from app.core.database import AsyncSessionLocal
from app.models.skill import Skill
from app.models.question import Question, QuestionSkill
from sqlalchemy import select

# (text, options[list], correct_index, difficulty, skill_name, estimated_minutes)
QUESTIONS = [
    ("What is the output of `print(type(5/2))` in Python 3?", ["int", "float", "str", "error"], 1, 1, "python_basics", 1),
    ("Which keyword declares a constant variable in JavaScript?", ["var", "let", "const", "static"], 2, 1, "javascript_basics", 1),
    ("What does `WHERE` do in SQL?", ["Sorts rows", "Filters rows", "Groups rows", "Joins tables"], 1, 1, "sql_basics", 1),
    ("An INNER JOIN returns:", ["All rows from both tables", "Only matching rows in both tables", "Only left table rows", "Only right table rows"], 1, 2, "sql_joins", 2),
    ("Time complexity of binary search on a sorted array of n elements:", ["O(n)", "O(log n)", "O(n log n)", "O(1)"], 1, 2, "sorting_searching", 2),
    ("Which data structure uses LIFO order?", ["Queue", "Stack", "Array", "Tree"], 1, 1, "data_structures_stack_queue", 1),
    ("A HTTP status code 404 means:", ["Server error", "Unauthorized", "Not Found", "Success"], 2, 1, "http_fundamentals", 1),
    ("REST APIs are typically stateless. What does 'stateless' mean here?", ["Server stores session data", "Each request is independent, no stored client context", "No database is used", "APIs cannot use JSON"], 1, 2, "rest_apis", 2),
    ("JWT stands for:", ["Java Web Token", "JSON Web Token", "Joint Web Transfer", "JavaScript Web Type"], 1, 1, "api_authentication", 1),
    ("Which best describes OOP inheritance?", ["Hiding data", "A class acquiring properties of another class", "Combining data and functions", "Executing code repeatedly"], 1, 2, "oops", 2),
    ("Recursion requires which of these to avoid infinite calls?", ["A loop", "A base case", "A global variable", "A class"], 1, 2, "recursion", 2),
    ("Which of these has average O(1) lookup time?", ["Array", "Linked List", "Hash Map", "Binary Tree"], 2, 2, "hashing", 2),
    ("In a binary search tree, an in-order traversal visits nodes:", ["Randomly", "In sorted order", "Root first always", "Right to left only"], 1, 3, "data_structures_trees", 3),
    ("Which CSS property controls text size?", ["font-weight", "font-size", "text-style", "font-scale"], 1, 1, "html_css", 1),
    ("In React, `props` are used to:", ["Store internal mutable state", "Pass data from parent to child component", "Style components", "Handle routing"], 1, 2, "react_basics", 2),
    ("`git commit` does what?", ["Uploads code to remote", "Saves a snapshot of staged changes locally", "Creates a new branch", "Deletes history"], 1, 1, "git_basics", 1),
    ("Which pandas method reads a CSV file?", ["pd.read_csv()", "pd.load_csv()", "pd.open_csv()", "pd.import_csv()"], 0, 1, "pandas_basics", 1),
    ("Which is a common way to handle missing values in a dataset?", ["Ignore the dataset entirely", "Fill with mean/median or drop rows", "Always delete the column", "Convert to strings"], 1, 2, "data_cleaning", 2),
    ("The median of [1, 3, 3, 6, 7, 8, 9] is:", ["3", "6", "7", "5"], 1, 2, "basic_stats", 2),
    ("A bar chart is best suited for:", ["Showing trends over continuous time", "Comparing discrete categories", "Showing correlation between 2 numeric vars", "Showing distribution shape"], 1, 1, "visualization", 1),
    ("In Excel, VLOOKUP is used to:", ["Sort data", "Look up a value in a table by matching a key", "Create charts", "Validate data types"], 1, 2, "excel_basics", 2),
    ("GROUP BY in SQL is typically used with:", ["JOIN only", "Aggregate functions like COUNT, SUM", "WHERE clause only", "CREATE TABLE"], 1, 2, "data_aggregation", 2),
    ("A p-value below 0.05 typically suggests:", ["No relationship exists", "Statistically significant result", "The sample size is too small", "The data is normally distributed"], 1, 3, "hypothesis_testing", 3),
    ("Linear regression is used to model:", ["Categorical outcomes only", "A linear relationship between variables", "Only time-series data", "Text classification"], 1, 2, "regression_basics", 2),
    ("A good subject line for a professional email should be:", ["Vague and long", "Clear and specific to the content", "All caps for emphasis", "Left blank"], 1, 1, "email_writing", 1),
    ("A resume should ideally:", ["Include your entire life story", "Highlight relevant, quantifiable achievements", "Avoid mentioning skills", "Be handwritten"], 1, 1, "resume_writing", 1),
    ("The STAR method in interviews stands for:", ["Situation, Task, Action, Result", "Story, Time, Action, Review", "Skill, Talent, Ability, Result", "Situation, Team, Action, Review"], 0, 2, "interview_basics", 2),
    ("Effective public speaking primarily benefits from:", ["Reading slides word for word", "Practicing pacing, tone, and audience engagement", "Speaking as fast as possible", "Avoiding eye contact"], 1, 1, "public_speaking", 1),
    ("Active listening includes:", ["Interrupting to give your opinion", "Paraphrasing to confirm understanding", "Multitasking while listening", "Thinking of your reply while others talk"], 1, 1, "active_listening", 1),
    ("Good technical documentation should be:", ["Written only for experts", "Clear, concise, and example-driven", "As long as possible", "Free of any examples"], 1, 2, "technical_writing", 2),
    ("A key principle of negotiation is:", ["Winning at all costs", "Finding mutually beneficial outcomes", "Never compromising", "Avoiding preparation"], 1, 2, "negotiation_basics", 2),
    ("Constructive feedback should be:", ["Vague and general", "Specific, actionable, and respectful", "Delivered publicly to embarrass", "Focused only on negatives"], 1, 1, "feedback_giving", 1),
    ("What does time complexity O(n^2) typically indicate?", ["Constant time regardless of input", "Nested loops over input size n", "Logarithmic growth", "Single pass through data"], 1, 2, "time_complexity", 2),
    ("Which loop structure best avoids repeating code for a known number of iterations?", ["if statement", "for loop", "try/except", "class definition"], 1, 1, "control_flow", 1),
    ("A function's main purpose is to:", ["Store global state only", "Encapsulate reusable logic", "Replace all variables", "Slow down execution"], 1, 1, "functions", 1),
    ("Reversing a string 'hello' results in:", ["olleh", "hello", "helol", "Error"], 0, 1, "strings", 1),
    ("Debugging typically starts with:", ["Rewriting the whole program", "Reproducing the bug consistently", "Ignoring error messages", "Deleting the code"], 1, 1, "debugging", 1),
    ("Unit tests are best used to:", ["Replace all documentation", "Verify individual units of code work as expected", "Deploy code to production", "Design the UI"], 1, 2, "unit_testing", 2),
    ("A well-branded LinkedIn profile should include:", ["No profile photo", "A clear headline and relevant experience", "Only personal hobbies", "Outdated job titles"], 1, 1, "linkedin_branding", 1),
    ("Cold outreach messages are most effective when:", ["Generic and mass-copied", "Personalized and concise", "Extremely long", "Sent without context"], 1, 2, "cold_outreach", 2),
]


async def seed():
    async with AsyncSessionLocal() as db:
        skills = (await db.execute(select(Skill))).scalars().all()
        skill_name_to_id = {s.name: s.id for s in skills}

        existing_texts = {q.text for q in (await db.execute(select(Question))).scalars().all()}

        count = 0
        for text, options, correct_idx, difficulty, skill_name, est_min in QUESTIONS:
            if text in existing_texts:
                continue
            skill_id = skill_name_to_id.get(skill_name)
            if not skill_id:
                print(f"Skipping '{text[:40]}...' — unknown skill '{skill_name}'")
                continue

            question = Question(
                type="mcq",
                text=text,
                options={"choices": options},
                correct_answer={"index": correct_idx},
                difficulty=difficulty,
                estimated_minutes=est_min,
            )
            db.add(question)
            await db.flush()
            db.add(QuestionSkill(question_id=question.id, skill_id=skill_id, weight=1.0))
            count += 1

        await db.commit()
        print(f"Seeded {count} questions.")


if __name__ == "__main__":
    asyncio.run(seed())
