class Product {
    constructor(database) {
        this.database = database;
    }

    async list() {
        const productCategoryDB = await this.database.table("product_category").find({});
        const productCategory = new Object;

        for (const category of productCategoryDB) {
            const productListDB = await this.database.table("product_list").find({ category_id: category.id });
            category.tags = (!category.tags || (category.tags == null)) ? [] : category.tags.split(',').map(function(item) {
                return item.trim();
            });
            category.list = new Object;

            for (const list of productListDB) {
                if (list.categoryId == category.id) {
                    category.list[list.id] = list
                    list.tags = (!list.tags || (list.tags == null)) ? [] : list.tags.split(',').map(function(item) {
                        return item.trim();
                    });
                    list.tags.push(list.name.toLowerCase());
                    list.tags.push(list.name.replace(/\s/g, "").toLowerCase());

                    category.tags = category.tags.concat(list.tags)
                }
            }

            productCategory[category.id] = category
        }

        return productCategory;
    }

    async get(id) {
        const list = await this.list();
        const args = id.split('_');

        const categoryID = args[0];
        const productID = args[1];

        if (list[categoryID] && list[categoryID].list && list[categoryID].list[productID]) {
            return list[categoryID].list[productID];
        }

        return false;
    }

}

module.exports = (database) => new Product(database);