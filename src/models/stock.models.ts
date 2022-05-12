import Prisma from '.';

export const createStockList = async (data) => {

    const creator = await Prisma.singleStock.createMany({
        data
    });

    if (creator.count === data.length) return data

}