class Product {
    constructor(database) {
        this.database = database;
    }

    async list() {
        const categoryListDB = await this.database.table("product_category").find({});
        const categoryList = new Object;

        for (const category of categoryListDB) {
            const productListDB = await this.database.table("product_list").find({ category_id: category.id });

            category.tags = this.parseTag(category);
            category.list = new Object;

            for (var product of productListDB) {
                if (product.categoryId == category.id) {
                    product = await this.parseProduct(product);
                    product.categoryName = category.name;

                    category.list[product.id] = product;
                    category.tags = category.tags.concat(product.tags)
                }
            }

            categoryList[category.id] = category;
        }

        return categoryList;
    }

    async get(id) {
        const productList = await this.database.table("product_list").find({ id });

        if (productList.length > 0) {
            const category = await this.database.table("product_category").find({ id: productList[0].categoryId });
            productList[0].categoryName = category[0].name;

            return await this.parseProduct(productList[0]);
        } else {
            return false;
        }
    }

    async parseProduct(product) {
        product.extendable = Boolean(product.extendable);
        product.stackable = Boolean(product.stackable);
        product.tags = this.parseTag(product);
        product.score = 0;
        product.reviews = [];

        const reviews = await this.database.table("product_reviews").find({ product_id: product.id });
        if (reviews.length > 0) {
            for (const review of reviews) {
                const members = await this.database.table("members").find({ id: review.memberId });
                product.score += review.stars;
                product.reviews.push({
                    username: (members[0]) ? members[0].username : "User Not Found",
                    review: review.reviews,
                    score: review.stars,
                    date: review.date,
                })
            }
            product.score = Math.round(product.score / reviews.length);
        }

        return product;
    }

    parseTag(obj) {
        var tags;
        if (!obj.tags || obj.tags == null) {
            tags = new Array;
        } else {
            tags = obj.tags.split(',').map((item) => item.trim());
        }

        tags.push(obj.name.toLowerCase(), obj.name.replace(/\s/g, "").toLowerCase());
        return tags;
    }

}

module.exports = (database) => new Product(database);