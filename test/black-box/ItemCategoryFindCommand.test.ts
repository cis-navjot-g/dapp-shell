import { rpc, api } from './lib/api';

import { BlackBoxTestUtil } from './lib/BlackBoxTestUtil';
import { Logger } from '../../src/core/Logger';
import { ItemCategoryFindCommand } from '../../src/api/commands/itemcategory/ItemCategoryFindCommand';

describe('ItemCategoryFindCommand', () => {

    const testUtil = new BlackBoxTestUtil();
    const itemCategoryService = null;
    const method =  new ItemCategoryFindCommand(itemCategoryService, Logger).name;

    beforeAll(async () => {
        await testUtil.cleanDb();
    });

    test('Should get categories, if found by category name string', async () => {
        //  find categories
        const res = await rpc(method, ['Apparel']);
        res.expectJson();
        res.expectStatusCode(200);
        const result: any = res.getBody()['result'];
        expect(result.length).not.toBe(0);
    });

    test('Should not get categories, if found by blank string', async () => {
        //  find categories
        const res = await rpc(method, []);
        res.expectJson();
        res.expectStatusCode(200);
        const result: any = res.getBody()['result'];
        expect(result.length).toBe(0);
    });

    test('Should not get any categories, if found by non-existing category name string', async () => {
        //  find categories
        const res = await rpc(method, ['NOTFOUNDCATEGORY']);
        res.expectJson();
        res.expectStatusCode(200);
        const result: any = res.getBody()['result'];
        expect(result.length).toBe(0);
    });
});
