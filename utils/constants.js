import { bot, reply } from "./telegram";

export const userDocName = "users";
export const countryDocName = "country";
export const questionsDocName = "questions";
export const chatDocName = "chat";
export const filesDocName = "files";

export const AnswerResponse = {
  //   reply_to_message_id: ctx.message_id,
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "    👍    ",
          callback_data: "answerResponse:Like",
        },
        {
          text: "👎",
          callback_data: "answerResponse:Dislike",
        },
        {
          text: "🛑 End Chat",
          callback_data: "answerResponse:End",
        },
      ],
    ],
  },
};

export const LikeDislikeMainMenu = {
  //   reply_to_message_id: ctx.message_id,
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "👍",
          callback_data: "LikeDislikeMainMenu:Like",
        },
        {
          text: "👎",
          callback_data: "LikeDislikeMainMenu:Dislike",
        },
        {
          text: "⬅️",
          callback_data: "LikeDislikeMainMenu:End",
        },
      ],
    ],
  },
};

export const MainMenu = {
  //   reply_to_message_id: ctx.message_id,
  reply_markup: {
    resize_keyboard: false,
    inline_keyboard: [
      [
        {
          text: "🗣 Chat with PawLee",
          callback_data: "handleTalkToPawlee:Talk with PawLee",
        },
        // {
        //   text: "💸 Income Tracker",
        //   callback_data: "handleIncomeTracker:Income Tracker",
        // },
      ],
      [
        {
          text: "📣 Quest Incentives",
          callback_data: "handleIncentives:Incentives",
        },
        {
          text: "📣 Surge Fees",
          callback_data: "handleAnnouncements:Announcements",
        },
      ],
      [
        // {
        //   text: "🧾 Receipts",
        //   callback_data: "handleReceipt:parse this receipt data",
        // },
        // {
        //   text: "👤 Edit Profile",
        //   callback_data: "handleProfile:Edit Profile",
        // },
      ],
      [
        {
          text: "❓ Help",
          callback_data: "handleHelp:Help me now and help the world",
        },
        {
          text: "👤 Edit Profile",
          callback_data: "handleProfile:Edit Profile",
        },
      ],
    ],
  },
};

export const EditProfile = {
  //   reply_to_message_id: ctx.message_id,
  reply_markup: {
    resize_keyboard: false,
    inline_keyboard: [
      [
        {
          text: "🗣 Zone",
          callback_data: "handleEditProfile:Zone",
        },
        {
          text: "💸 Vehicle",
          callback_data: "handleEditProfile:Vehicle",
        },
      ],
      [
        {
          text: "💸 Company",
          callback_data: "handleEditProfile:Company",
        },
        {
          text: "📣 City",
          callback_data: "handleEditProfile:City",
        },
      ],
      [
        {
          text: "📋 Back to Main Menu ⬅️",
          callback_data: "handleMainMenu:Company",
        },
      ],
    ],
  },
};

export const SurgeFee = {
  //   reply_to_message_id: ctx.message_id,
  reply_markup: {
    resize_keyboard: false,
    inline_keyboard: [
      [
        {
          text: "Next 2 hours",
          callback_data: "handleSurgeFee:Next 2 Hours",
        },
        {
          text: "Today",
          callback_data: "handleSurgeFee:Today",
        },
      ],
      [
        {
          text: "Tomorrow",
          callback_data: "handleSurgeFee:Tomorrow",
        },
        {
          text: "This Week",
          callback_data: "handleSurgeFee:This Week",
        },
      ],
      [
        {
          text: "Next Week",
          callback_data: "handleSurgeFee:Next Week",
        },
      ],
    ],
  },
};

export const IncomeTracker = {
  //   reply_to_message_id: ctx.message_id,
  reply_markup: {
    resize_keyboard: false,
    inline_keyboard: [
      [
        {
          text: "Income goal 🏁",
          callback_data: "handleIncomeTrackerGoal:Income goal 🏁",
        },
        {
          text: "Total income 💰",
          callback_data: "handleIncomeTrackerGoal:Date 🚩",
        },
      ],
      [
        {
          text: "Incentives & Tips +",
          callback_data: "handleIncomeTrackerGoal:Incentives & Tips +",
        },
        {
          text: "Hour of day 🕔",
          callback_data: "handleIncomeTrackerGoal:Hour of day 🕔",
        },
      ],
    ],
  },
};

export const QuestIncentive = {
  //   reply_to_message_id: ctx.message_id,
  reply_markup: {
    resize_keyboard: false,
    inline_keyboard: [
      [
        {
          text: "This Week",
          callback_data: "handleQuestIncentive:This Week",
        },
        {
          text: "Next Week",
          callback_data: "handleQuestIncentive:Next Week",
        },
      ],
    ],
  },
};

export const defaultResponse = async (ctx, msg = "") => {
  // console.log("---- defaultResponse ----", ctx, msg);
  return await bot.sendMessage(
    ctx.chat.id,
    `Hi ${ctx.from.first_name}! \n\n ${msg} \n\n Please chose one of the following to continue... \n\nThanks`,
    MainMenu
  );
};
