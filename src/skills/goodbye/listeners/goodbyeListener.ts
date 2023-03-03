import { Middleware } from "grammy/composer.ts";
import { Filter } from "grammy/filter.ts";
import { getLogger } from "std/log/mod.ts";
import { BotContext } from "/src/context/mod.ts";

export const goodbyeListener: Middleware<
  Filter<BotContext, ":left_chat_member">
> = async (
  ctx,
) => {
  await ctx.reply("Was nice to see you!", {
    reply_to_message_id: ctx.message?.message_id,
  });

  const authorId = ctx.from?.id;
  const userId = ctx.msg.left_chat_member.id;

  if (authorId !== userId) {
    getLogger().info(
      `User with id ${userId} was removed by ${authorId}. Not adding to counter.`,
    );
    return;
  }

  if (ctx.session.goodbyeCounter.has(userId)) {
    const current = ctx.session.goodbyeCounter.get(userId)!;
    ctx.session.goodbyeCounter.set(userId, {
      userId,
      count: current.count + 1,
    });
    return;
  }

  ctx.session.goodbyeCounter.set(userId, {
    userId,
    count: 1,
  });
};
