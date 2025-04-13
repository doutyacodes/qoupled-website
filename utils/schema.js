import { boolean, date, datetime, decimal, float, int, mysqlEnum, mysqlTable, primaryKey, text, time, timestamp, varchar } from "drizzle-orm/mysql-core";

export const USER_DETAILS = mysqlTable('user_details', {
    id: int('id').notNull().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    dob: date('dob').notNull(),
    gender: varchar('gender', { length: 50 }).notNull(),
    location: varchar('location', { length: 255 }).notNull(),
    education: varchar('education', { length: 255 }).notNull(),
    religion: varchar('religion', { length: 100 }).notNull(),
    height: int('height').notNull(),
    weight: int('weight').notNull(),
    university: varchar('university', { length: 50 }).notNull(),
    citizenship: varchar('citizenship', { length: 20 }).notNull()
});
export const USER=mysqlTable('user',{
    id: int('id').notNull().primaryKey().autoincrement(),
    username: varchar('username', { length: 255 }).notNull(),
    birthDate: date('birthDate').notNull(),
    password:varchar('password',{length:150}).default(null),
    gender:varchar('gender',{length:150}).default(null)
})
export const USER_LANGUAGES = mysqlTable('user_languages', {
    id: int('id').notNull().primaryKey(),
    user_id: int('user_id').notNull(),
    language_id: int('language_id').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow()
});
export const USER_OCCUPATION = mysqlTable('user_occupation', {
    id: int('id').notNull().primaryKey(),
    user_id: int('user_id').notNull(),
    place: varchar('place', { length: 255 }).notNull(),
    empt_type: varchar('empt_type', { length: 100 }).notNull(),
    emp_name: varchar('emp_name', { length: 255 }).default(null),
    emp_nature: varchar('emp_nature', { length: 255 }).notNull(),
    annual_income: int('annual_income', { length: 20 }).notNull()
});
export const LANGUAGES = mysqlTable('languages', {
    id: int('id').notNull().primaryKey(),
    title: varchar('title', { length: 256 }).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow()
});
export const ACCOUNT_CREATOR= mysqlTable('account_creator',{
    id:int('id').autoincrement().notNull().primaryKey(),
    title:varchar('title',{length:200}).notNull(),
    created_date: datetime('created_at').notNull(),
});
export const ANALYTICS_QUESTION = mysqlTable('analytics_question', {
    id: int('id').primaryKey().autoincrement(),
    question_text: varchar('question_text', { length: 300 }).notNull(),
    quiz_id: int('quiz_id').notNull(),
});
export const OPTIONS = mysqlTable('options', {
    id: int('id').primaryKey().autoincrement(),
    option_text: varchar('option_text', { length: 300 }).notNull(),
    analytic_id: int('analytic_id').notNull(),
    question_id: int('question_id').notNull(),
});
export const QUIZ_SEQUENCES = mysqlTable('quiz_sequences', {
    id: int('id').primaryKey().autoincrement(),
    type_sequence: text('type_sequence').notNull().default(''),
    user_id: int('user_id').notNull(),
    quiz_id: int('quiz_id').notNull(), 
    createddate: datetime('createddate').notNull(),
    isCompleted: boolean('isCompleted').notNull().default(false), 
    isStarted: boolean('isStarted').notNull().default(false),    
});

export const USER_PROGRESS = mysqlTable('user_progress', {
    id: int('id').primaryKey().autoincrement(),
    user_id: int('user_id').notNull(),
    question_id: int('question_id').notNull(),
    option_id: int('option_id').notNull(),
    analytic_id: int('analytic_id').notNull(),
    created_at: datetime('created_at').notNull(),
});

export const TESTS = mysqlTable('tests', {
    test_id: int('test_id').autoincrement().primaryKey(),
    test_name: varchar('test_name', { length: 255 }).notNull(),  
    description: text('description').default(null), 
    total_questions: int('total_questions').notNull(),
    created_at: timestamp('created_at').defaultNow(),
  });

export const QUESTIONS = mysqlTable('questions', {
    id: int('id').autoincrement().primaryKey(), 
    questionText: varchar('question_text', { length: 255 }).notNull(),
    test_id: int('test_id').notNull().references(() => TESTS.test_id),
  
  });

  export const ANSWERS = mysqlTable('answers', {
    id: int('id').autoincrement().primaryKey(),  // Auto-incrementing primary key for answers
    question_id: int('question_id').notNull().references(() => QUESTIONS.id),  // Foreign key to the questions table
    answerText: varchar('answer_text', { length: 255 }).notNull(),  // Answer text
    points: int('points').notNull(),  // Points for each answer
});

export const QUIZ_COMPLETION = mysqlTable('quiz_completion', {
    completion_id: int('completion_id').autoincrement().primaryKey(),  
    user_id: int('user_id').notNull().references(() => USER_DETAILS.id),
    test_id: int('test_id').notNull().references(() => TESTS.test_id),
    isStarted: boolean('isStarted').notNull().default(false), 
    completed: mysqlEnum('completed', ['no', 'yes']).notNull().default('no'),
    completion_timestamp: timestamp('completion_timestamp').defaultNow(),
});

export const COMPATIBILITY_RESULTS = mysqlTable('compatibility_results', {
    result_id: int('result_id').autoincrement().primaryKey(),  // Auto-incrementing primary key for results
    test_id: int('test_id').notNull().references(() => TESTS.test_id),  
    user_1_id: int('user_1_id').notNull().references(() => USER.id),
    user_2_id: int('user_2_id').notNull().references(() => USER.id), 
    compatibilityScore: int('compatibility_score').default(0), 
});
export const TEST_PROGRESS  = mysqlTable('test_progress', {
    progress_id: int('progress_id').autoincrement().primaryKey(), // Auto-incrementing primary key for progress
    user_id: int('user_id').notNull().references(() => USER_DETAILS.id), // Reference to the user taking the test
    test_id: int('test_id').notNull().references(() => TESTS.test_id),
    question_id: int('question_id').notNull().references(() => QUESTIONS.id), // Reference to the current question
    selected_answer_id: int('selected_answer_id').references(() => ANSWERS.id).default(null), // Optional: Reference to the selected answer
    points_received: int('points_received').default(0), // New field to store points the user got for the question
    progress_timestamp: timestamp('progress_timestamp').defaultNow(), // Timestamp for each progress entry
  });

  export const INVITATIONS = mysqlTable('invitations', {
    id: int('id').autoincrement().primaryKey(),
    user_id: int('user_id').notNull().references(() => USER.id), // ID of the invited user
    inviter_id: int('inviter_id').notNull().references(() => USER.id), // ID of the user who shared the link
    compatibility_checked: boolean('compatibility_checked').notNull().default(false), // Whether compatibility was checked
    created_at: timestamp('created_at').defaultNow(),
  });
  export const COUPLES = mysqlTable('couples', {
    id: int('id').autoincrement().primaryKey(),
    user_id: int('user_id').notNull().references(() => USER.id), // Reference to the user who sent the request
    couple_id: int('couple_id').notNull().references(() => USER.id), // Reference to the user receiving the request
    status: mysqlEnum('status', ['pending', 'accepted', 'rejected']).notNull().default('pending'), // Status of the couple request
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const PEOPLE_PAIR = mysqlTable('people_pair', {
    id: int('id').autoincrement().primaryKey(),
    pair1: varchar('pair1', { length: 4 }).notNull(),
    pair2: varchar('pair2', { length: 4 }).notNull(),
    description: text('description').default(null)
  });

  export const USER_RED_FLAGS = mysqlTable('user_red_flags', {
    id: int('id').autoincrement().primaryKey(),
    user_id: int('user_id').notNull().references(() => USER.id, { onDelete: 'cascade' }),
    answer_id: int('answer_id').notNull().references(() => ANSWERS.id, { onDelete: 'cascade' }),
    created_at: timestamp('created_at').defaultNow()
  }, (table) => {
    return {
      userAnswerUnique: unique('user_answer_unique').on(table.user_id, table.answer_id)
    }
  });