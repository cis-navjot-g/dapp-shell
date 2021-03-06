import { rpc, api } from './lib/api';

import { BlackBoxTestUtil } from './lib/BlackBoxTestUtil';
import { Logger } from '../../src/core/Logger';
import { ItemCategoriesGetCommand } from '../../src/api/commands/itemcategory/ItemCategoriesGetCommand';

describe('ItemCategoriesGetCommand', () => {

    const testUtil = new BlackBoxTestUtil();
    const itemCategoryService = null;
    const method =  new ItemCategoriesGetCommand(itemCategoryService, Logger).name;

    beforeAll(async () => {
        await testUtil.cleanDb();
    });

    test('Should get the categories by RPC', async () => {
        //  test default category data
        const res = await rpc(method, []);
        res.expectJson();
        res.expectStatusCode(200);
        const result: any = res.getBody()['result'];
        // check default-ROOT category
        expect(result.key).toBe('cat_ROOT');
        expect(result.parentItemCategoryId).toBe(null);
        // check category
        const category = result.ChildItemCategories;
        expect(category.length).not.toBe(0);
        // check child category
        const firstCategory = category[0];
        expect(firstCategory.parentItemCategoryId).not.toBe(null);
        const categoryChild = firstCategory.ChildItemCategories;
        expect(categoryChild.length).not.toBe(0);
    });

});
