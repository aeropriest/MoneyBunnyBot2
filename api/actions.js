import { reply, bot } from "./../utils/telegram";
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

import { getAnswer } from "./../utils/openai";
import { replyWithId } from "./../utils/telegram";
import { updateUser } from "./../utils/firebase";
import {
  AnswerResponse,
  MainMenu,
  EditProfile,
  SurgeFee,
  LikeDislikeMainMenu,
  QuestIncentive,
  IncomeTracker,
} from "../utils/constants";
import { defaultResponse } from "../utils/constants";
export const actions = [
  {
    action: "handleTalkToPawlee",
    description: "Chat Pawlee",
    func: async (ctx, param) => {
      console.log("handleTalkToPawlee ------", ctx);
      const keyboard = {
        //   reply_to_message_id: ctx.message_id,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🌧️ Tips for riding in rain 🌧️",
                callback_data: "replyFromPawlee:Tips for riding in rain",
              },
            ],
            [
              {
                text: "⛽ How to save fuel? ⛽",
                callback_data: "replyFromPawlee:How to save fuel?",
              },
            ],
            [
              {
                text: "💰 Tips for saving money? 💰",
                callback_data: "replyFromPawlee:Tips for saving money?",
              },
            ],
          ],
        },
      };

      await updateUser({
        telegramId: ctx.from.id,
        lastCommand: "talk",
      });

      const telegramId = ctx?.from?.id ? ctx?.from?.id : ctx?.chat?.id;
      await bot.sendMessage(
        telegramId,
        `Hi ${ctx.from.first_name}! 👋 \nAs an AI language model, I'm here to assist you in finding information quickly and easily, making your work more efficient`,
        keyboard
      );
      return await bot.sendMessage(
        telegramId,
        `\n\n Ask me anything work-related, and I'll provide the best answer I can!`
      );
    },
  },
  {
    action: "replyFromPawlee",
    description: "Chat with Pawlee",
    func: async (ctx, param) => {
      console.log("replyFromPawlee ------", param);
      const telegramId = ctx?.from?.id ? ctx?.from?.id : ctx?.chat?.id;
      const answer = await getAnswer(param);
      // const answer = "The answer is coming for " + param;
      return await bot.sendMessage(telegramId, answer, AnswerResponse);
    },
  },
  {
    action: "answerResponse",
    description: "Response to answer",
    func: async (ctx, param) => {
      console.log("answerResponse ------", param);
      await updateUser({
        telegramId: ctx.from.id,
        lastCommand: "none",
      });

      return await bot.sendMessage(
        ctx.from.id,
        `It was pleasure talking to you ${ctx?.from?.first_name}, let's talk again soon.`,
        MainMenu
      );
    },
  },
  {
    action: "handleIncomeTracker",
    description: "Send announcements",
    func: async (ctx, param) => {
      await bot.sendMessage(
        ctx.from.id,
        `\n Hey ${ctx?.from?.first_name}, 👋 Juggling multiple sources of income can be a hassle. Let me simplify things for you by putting everything in one place!`
      );
      await bot.sendMessage(
        ctx.from.id,
        `\n Just share your income statements, and we'll provide a summary of your earnings.`
      );
      return await bot.sendMessage(
        ctx.from.id,
        `\n Plus, by sharing, you'll unlock constant access to all PawLee features. Work smarter, not harder. Are you ready?`,
        IncomeTracker
      );
    },
  },

  {
    action: "handleIncomeTrackerGoal",
    description: "Send announcements",
    func: async (ctx, param) => {
      return await bot.sendMessage(ctx.from.id, `\n income goal is ${param}`);
    },
  },
  {
    action: "handleAnnouncements",
    description: "Send announcements",
    func: async (ctx, param) => {
      return await bot.sendMessage(
        ctx.from.id,
        `\n Please chose the surge fee time... `,
        SurgeFee
      );
    },
  },
  {
    action: "handleMainMenu",
    description: "Go to main menu",
    func: async (ctx, param) => {
      return await bot.sendMessage(
        ctx.from.id,
        `\n Please chose one of the following to continue... `,
        MainMenu
      );
    },
  },
  {
    action: "handleProfile",
    description: "Edit profile",
    func: async (ctx, param) => {
      return await bot.sendMessage(
        ctx.from.id,
        `Chose the detail to edit\n`,
        EditProfile
      );
    },
  },
  {
    action: "handleExtraEarnings",
    description: "Extra Earnings",
    func: async (ctx, param) => {
      console.log("handleExtraEarnings ------", ctx);
      return replyWithId(
        ctx.from.id,

        `⚠️RULES OF THE WEEK⚠️
    
    We are JUST paying for:
    👉Payslips from 11:00 am to 2 pm and
         5:00 pm to 8 pm
    👉Payslips from the 🔟 days before Today
    👉Grab and Deliveroo payslips`
      );
    },
  },
  {
    action: "handleEditProfile",
    description: "Edit Profile ",
    func: async (ctx, param) => {
      return await bot.sendMessage(ctx.from.id, `Edit ${param}\n`);
    },
  },
  {
    action: "handleIncentives",
    description: "Handle Incentives",
    func: async (ctx, param) => {
      return await bot.sendMessage(
        ctx.from.id,
        `Chose the incentive duration\n`,
        QuestIncentive
      );
    },
  },
  {
    action: "LikeDislikeMainMenu",
    description: "Handle Incentives",
    func: async (ctx, param) => {
      return await bot.sendMessage(
        ctx.from.id,
        `Chose the action below\n`,
        MainMenu
      );
    },
  },
  {
    action: "handleQuestIncentive",
    description: "Handle Quest Incentives",
    func: async (ctx, param) => {
      const telegramId = ctx?.from?.id ? ctx?.from?.id : ctx?.chat?.id;
      //in the below function, check the param and pull the data for that duration
      //quest incentives and show below
      const announcement = `      
      \n The cumulative quest for ${param}      
       Make 45 orders 👉 receive +$21
       Make 60 orders 👉 receive +$52
       Make 80 orders 👉 receive +$85
       Make 95 orders 👉 receive +$113
       Make 115 orders 👉 receive +$144`;
      return await bot.sendMessage(
        telegramId,
        announcement,
        LikeDislikeMainMenu
      );
    },
  },
  {
    action: "handleSurgeFee",
    description: "Handle Incentives",

    func: async (ctx, param) => {
      const telegramId = ctx?.from?.id ? ctx?.from?.id : ctx?.chat?.id;
      const announcement = `
      
      \n The surge fee for ${param}
Mon, 27 Feb:
👉 3 am - 7 am receive +$1 extra per order
👉 11 am - 12 pm receive +$2 extra per order
👉 12 pm - 1 pm receive +$2 extra per order
👉 5 pm - 6 pm receive +$0.5 extra per order
👉 6 pm - 7 pm receive +$1 extra per order
👉 7 pm - 8 pm receive +$1 extra per order`;
      return await bot.sendMessage(
        telegramId,
        announcement,
        LikeDislikeMainMenu
      );
    },
  },
  {
    action: "handleHelp",
    func: async (ctx, param) => {
      console.log(ctx, param);
      let readStream = fs.createReadStream(
        "/Users/ashokjaiswal/Downloads/WhatsApp Image 2023-03-14 at 12.20.20 PM.jpeg"
      );
      let form = new FormData();

      // Send the photo to the user
      try {
        const imageUrl =
          "https://firebasestorage.googleapis.com/v0/b/gns-gpt-bot.appspot.com/o/assets%2Fpawlee-2-tutorial.png?alt=media&token=64da5765-8fa9-4dca-bee2-d5fb0f37d77d";
        const imageResponse = await axios.get(imageUrl, {
          responseType: "stream",
        });
        const readStream = imageResponse.data;

        form.append("photo", readStream);
        const re = await axios
          .post(
            `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN_GNSGPTBOT}/sendPhoto?chat_id=${ctx.from.id}`,
            form,
            {
              headers: form.getHeaders(),
            }
          )
          .then((response) => {
            console.log("sent photo already ", response.data);
          })
          .catch((error) => {
            console.log("error in sending file", error);
          });
      } catch (e) {
        console.log(e);
      }
      // const weather =
      //   "Press 👉 /menu to see all the options that I have for you.";
      // return reply(ctx, weather);
    },
  },
  {
    action: "handleReceipt",
    func: async (ctx, param) => {
      return await bot.sendMessage(
        ctx.from.id,
        `This is receipt send funciton ${param}\n`
      );
    },
  },
];

const AnswerResponse = {
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
          text: "🤐",
          callback_data: "answerResponse:End",
        },
      ],
    ],
  },
};

// export async function answerResponse(ctx, param) {
//   console.log("answerResponse ------", param);
//   await updateUser({
//     telegramId: ctx.from.id,
//     lastCommand: "none",
//   });

//   return await bot.sendMessage(
//     ctx.from.id,
//     `It was pleasure talking to you ${ctx?.from?.first_name}, let's talk again soon.`,
//     MainMenu
//   );
//   // return replyWithId(ctx.from.id, ``);
// }

export async function handleBackToMainMenu(ctx, param) {
  return await bot.sendMessage(
    ctx.chat.id,
    `Hi ${ctx.from.first_name}! \n\n ${msg} \n\n Please chose one of the following to continue... \n\nThanks`,
    MainMenu
  );
}

export async function onAction(ctx) {
  const actionData = ctx.data.split(":");
  console.log("--------------------------------");
  console.log("in onAction", actionData, ctx);
  console.log("--------------------------------");
  for (const action of actions) {
    console.log("Find the action and call it", actionData[0], action.action);
    if (action.action === actionData[0]) {
      return await action.func(ctx, actionData[1]);
    }
  }

  const mainMenuButton = {
    reply_markup: {
      resize_keyboard: false,
      inline_keyboard: [
        [
          {
            text: "📋 Back to Main Menu ⬅️",
            callback_data: "handleBackToMainMenu:Talk with PawLee",
          },
        ],
      ],
    },
  };
  return await defaultResponse(
    ctx,
    "Sorry, I did not understand your request."
  );
  // return await bot.sendMessage(
  //   telegramId,
  //   `Sorry, I don't understand that command  ${ctx.data}`,
  //   mainMenuButton
  // );
  // return replyWithId(
  //   ctx.from.id,
  //   `Sorry, I don't understand that command  ${ctx.data}`
  // );
}
