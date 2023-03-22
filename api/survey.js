import { reply, bot } from "../utils/telegram";
import {
  addUser,
  saveMessage,
  getQuestions,
  updateUser,
  getAnswers,
  getUser,
} from "../utils/firebase";

import { MainMenu } from "../utils/constants";

export const questions = [
  {
    question: "What is your gender? 🚹 🚺",
    answers: [
      [{ text: "👨 Man" }, { text: "👩 Woman" }, { text: "🧑 Others" }],
    ],
    key: "gender",
  },
  {
    question: "How old are you? 🎁 🎂 🎈",
    answers: [
      [{ text: "18-25 🎓" }, { text: "25-35 👨‍💼" }, { text: "35-45 🧑‍💼" }],
      [{ text: "45-55 👴" }, { text: "55-65 🧓" }, { text: "65+ 🧑‍🦳" }],
    ],
    key: "age",
  },
  {
    question: "Chose the delivery company you work for the most: 🏍️ 🚴 🚗 ",
    answers: [
      [{ text: "🛵 Grab" }, { text: "🍽️ FoodPanda" }, { text: "🍕 Deliveroo" }],
    ],
    key: "company",
  },
  {
    question: " What vehicle you ride? 🚲 🛵 🚗",
    answers: [
      [{ text: "🏍️ Motorcycle" }, { text: "🚴 Cycle" }],
      [{ text: "🚗 Car" }, { text: "🚲 E-bike" }, { text: "🚶 Walk" }],
    ],
    key: "vehicle",
  },
  {
    question: "What's your preferred zone in SG to work in? 📍 ",
    answers: [
      [{ text: "Sengkang" }, { text: "West" }],
      [{ text: "Panjang" }, { text: "Yishun" }],
      [{ text: "Bedok" }, { text: "Serangoon" }],
      [{ text: "Geylang" }, { text: "Bukit Timah" }],
      [{ text: "East" }, { text: "Far East" }],
      [{ text: "SG South" }, { text: "AMK" }],
      [{ text: "Woodlands" }],
    ],
    key: "zone",
  },
  {
    question:
      " How did you buy your mobility device? (Choose ‘Not applicable’ if you don’t use a vehicle) 🛴 🚲 🚗",
    answers: [
      [{ text: "🏦 Bank Loan" }, { text: "💰 Savings" }],
      [{ text: "🤝 Borrowed from friends" }],
      [{ text: "🚫 Not applicable" }],
    ],
    kye: "purchase",
  },
  {
    question: "How often do you take your mobility device to maintenance? ⚙️",
    answers: [
      [{ text: "Every 2️⃣ weeks" }, { text: "Every 4️⃣ weeks" }],
      [{ text: "Every 6️⃣ weeks" }, { text: "Every 8️⃣ weeks" }],
      [{ text: "Other" }],
    ],
    key: "maintenance_frequency",
  },
  {
    question:
      "How much do you spend each time you do maintenance to your mobility device? 💸",
    answers: [
      [{ text: "0 to 50 SGD" }, { text: "50 to 100 SGD" }],
      [{ text: "100 to 250 SGD" }, { text: "250 to 500 SGD" }],
      [{ text: "500+ SGD" }, { text: "Other" }],
    ],
    key: "maintenance_cost",
  },
  {
    question:
      "Where do you spend the greatest amount of money to do your work? 🤑",
    answers: [
      [{ text: "Internet data for mobile phone 🌐" }],
      [{ text: "Maintenance ⚙️" }, { text: "Fuel ⛽" }],
      [{ text: "Mobile phone 📱" }, { text: "Other" }],
    ],
    key: "work_expenses",
  },
  {
    question: "What do you do during the off-peak hours? ⌛",
    answers: [
      [{ text: "I rest 💤" }, { text: "I eat 🥢" }],
      [{ text: "I would like to earn extra 💰" }],
      [{ text: "I have another job 📛" }],
      [{ text: "I learn new things 📚" }],
      [{ text: "Other" }],
    ],
    key: "off_peak_activities",
  },
  {
    question: "Do you think you have a stable income? 📈",
    answers: [[{ text: "Yes 👍" }, { text: "No ⛔" }]],
    key: "stable_income",
  },
  {
    question:
      "Are you currently looking for another job or a source of income? 🤝",
    answers: [
      [{ text: "Yes 👍" }, { text: "No ⛔" }],
      [{ text: "I already have another part-time job" }],
    ],
    key: "looking_for_job",
  },
  {
    question:
      "Do you feel that advice can help to increase your income as a rider? 🫰",
    answers: [[{ text: "Yes 👍" }, { text: "No ⛔" }]],
    key: "advice_for_income",
  },
  {
    question:
      "Have you ever taken out a loan from a bank within the past five years? 💵",
    answers: [[{ text: "Yes 👍" }, { text: "No ⛔" }]],
    key: "loan_history",
  },
  {
    question: "Do you record your monthly income and expenses? 📋",
    answers: [[{ text: "Yes 👍" }, { text: "No ⛔" }]],
    key: "record_income_expenses",
  },
  {
    question:
      "Have you ever had an accident that stopped you from earning an income? ✋",
    answers: [[{ text: "Yes 👍" }, { text: "No ⛔" }]],
    key: "accident_stopped_income",
  },
  {
    question: "Do you have insurance on your mobility device? 💰",
    answers: [[{ text: "Yes 👍" }, { text: "No ⛔" }]],
    key: "mobility_device_insurance",
  },
  {
    question:
      "Do you have income Insurance? Meaning that if you have an accident, they will give you some money to keep your income during recovery time? 💱",
    answers: [[{ text: "Yes 👍" }, { text: "No ⛔" }]],
    key: "income_insurance",
  },
  {
    question: "Do you save for retirement? 👴",
    answers: [[{ text: "Yes 👍" }, { text: "No ⛔" }]],
    key: "save_for_retirement",
  },
];

const showMainMenu = async (ctx, text) => {
  const ret = await bot.sendMessage(
    ctx.chat.id,
    `Hi ${ctx.from.first_name}! \n ${text} Please chose one of the following to continue? \n\n`,
    MainMenu
  );
};

const handleQuestion = async (
  ctx,
  question,
  msg = "",
  show_keyboard = false
) => {
  console.log("handleQuestion------", question);

  let { question: text, answers } = question;
  text = msg ? msg + "\n" + text : text;
  //   reply_to_message_id: ctx.message_id,
  return await bot.sendMessage(ctx.chat.id, text, {
    reply_markup: {
      // force_reply: true,
      resize_keyboard: true,
      one_time_keyboard: show_keyboard,
      keyboard: answers,
    },
  });
};

export async function surveyResponse(ctx) {
  let qIndex = ctx.user.questionIndex ? ctx.user.questionIndex : 0;

  console.log("surveyResponse------", qIndex);

  if (qIndex < questions.length) {
    await updateUser({
      telegramId: ctx.from.id,
      questionIndex: qIndex + 1,
    });
    return handleQuestion(
      ctx,
      questions[qIndex],
      "",
      qIndex >= questions.length - 1
    );
  }
  await updateUser({
    telegramId: ctx.from.id,
    lastCommand: "none",
  });

  return showMainMenu(
    ctx,
    "\n\n 🎉👏 Hooray! Your answers have been received and will help us personalize your experience. Thanks for taking the time! 🙌🤝 \n\n"
  );
}

export async function surveyResponse1(ctx) {
  const qIndex = ctx.user.questionIndex ? ctx.user.questionIndex : 0;
  console.log("surveyResponse------", qIndex);

  if (qIndex === 0) {
    await updateUser({ telegramId: ctx.from.id, questionIndex: qIndex + 1 });
    return handleQuestion(ctx, questions[qIndex + 1]);
  }

  if (qIndex >= questions.length) {
    if (!ctx.user.welcomed) {
      console.log("user not welcomed yet");
      try {
        await updateUser({
          telegramId: ctx.message.from.id,
          welcomed: true,
        });
      } catch (err) {
        console.log("Update user error", err);
      }
      await reply(
        "🎉👏 Hooray! Your answers have been received and will help us personalize your experience. Thanks for taking the time! 🙌🤝"
      );
      return showMainMenu(ctx);
    }
  }

  for (const answer of questions[qIndex].answers.flat()) {
    if (answer.text.includes(ctx.text)) {
      try {
        await updateUser({
          telegramId: ctx.from.id,
          questionIndex: qIndex + 1,
          [questions[qIndex].key]: ctx.text,
        });
      } catch (err) {
        console.log("Update user error", err);
      }
      if (qIndex + 1 < questions.length) {
        return handleQuestion(ctx, questions[qIndex + 1]);
      } else {
        await reply(
          "🎉👏 Hooray! Your answers have been received and will help us personalize your experience. Thanks for taking the time! 🙌🤝"
        );
        return showMainMenu(ctx);
      }
    }
  }
}

export async function handleStartSurvey(ctx) {
  if (ctx.user.questionIndex >= questions.length) {
    return showMainMenu(ctx, "\n You already finished the survey \n\n");
  }
  console.log("start the survey ", ctx.from.id);
  const userData = {
    telegramId: ctx.from.id,
    first_name: ctx.from.first_name,
    last_name: ctx.from.last_name,
    language_code: ctx.from.language_code,
    questionIndex: 0,
  };

  const user = await updateUser(userData);
  //   reply_to_message_id: ctx.message_id,
  return await bot.sendMessage(
    ctx.chat.id,
    `Hi ${ctx.from.first_name}! \n Ready to answer a few quick questions and earn $6 SGD of extra money?`,
    {
      reply_markup: {
        force_reply: true,
        resize_keyboard: true,
        one_time_keyboard: false,
        keyboard: [[{ text: "🏁 " }, { text: "Let's Got " }, { text: "🏁 " }]],
      },
    }
  );
}
