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
                    product.categoryName = category.name;
                    product = await this.parseProduct(product);

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
        product.tags = this.parseTag(product);
        product.score = 0;
        product.totalStock = 0;
        product.reviews = [];
        product.variants = [];

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

        const store = await this.database.table("store").find({ id: product.storeId });
        product.store = store[0];

        const variants = await this.database.table("product_variants").find({ product_id: product.id });
        for (const variant of variants) {
            variant.extendable = Boolean(variant.extendable);
            variant.stackable = Boolean(variant.stackable);

            if (!variant.extendable && variant.setupPrice) {
                variant.extendable = false;
                variant.price += variant.setupPrice;
                variant.setupPrice = 0;
            }

            product.variants.push(variant);
            product.totalStock += variant.stock;
        }

        product.variants = product.variants.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))

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