import sequalize from '../db.js'
import { DataTypes } from "sequelize";


const Article = sequalize.define('article', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, unique: true},
    quote: {type: DataTypes.STRING(512)},
    boldText: {type: DataTypes.TEXT},
    text: {type: DataTypes.TEXT},
    twoColumnContentFirst: {type: DataTypes.TEXT},
    twoColumnContentSecond: {type: DataTypes.TEXT},
    oneColumnContent: {type: DataTypes.TEXT},
    address: {type: DataTypes.STRING},
    author: {type: DataTypes.STRING, allowNull: false},
    hider: {type: DataTypes.STRING, defaultValue: 'light'},
})

const New = sequalize.define('new', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    subtitle: {type: DataTypes.STRING},
    title: {type: DataTypes.STRING, unique: true},
    quote: {type: DataTypes.STRING(512)},
    boldText: {type: DataTypes.TEXT},
    text: {type: DataTypes.TEXT},
    twoColumnContentFirst: {type: DataTypes.TEXT},
    twoColumnContentSecond: {type: DataTypes.TEXT},
    oneColumnContent: {type: DataTypes.TEXT},
    img: {type: DataTypes.STRING},
    author: {type: DataTypes.STRING, allowNull: false},
    hider: {type: DataTypes.STRING, defaultValue: 'light'},
})

const Partner = sequalize.define('partner', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    img: {type: DataTypes.STRING, required: true},
    link: {type: DataTypes.STRING, required: true, allowNull: false},
})

const Collection = sequalize.define('collection', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, required: true, unique: true},
    order: {type: DataTypes.INTEGER, allowNull: false, required: true},
    description: {type: DataTypes.TEXT, allowNull: false, required: true},
    img: {type: DataTypes.STRING, required: true, allowNull: false},
    link: {type: DataTypes.STRING, required: true, allowNull: false},
    hider: {type: DataTypes.STRING, defaultValue: 'light'}
})

const Instruction = sequalize.define('instruction', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, required: true, unique: true},
    description: {type: DataTypes.TEXT, allowNull: false, required: true},
    img: {type: DataTypes.STRING, required: true, allowNull: false},
    link: {type: DataTypes.STRING, required: true, allowNull: false},
    hider: {type: DataTypes.STRING, defaultValue: 'light'}
})

const Email = sequalize.define('email', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    isActivated: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    unsubscribeLink: {type: DataTypes.STRING, unique: true, allowNull: false}
})

const Token = sequalize.define('token', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    chain: {type: DataTypes.STRING, allowNull: false, required: true},
    liquidity: {type: DataTypes.BIGINT, allowNull: false, required: true},
    price: {type: DataTypes.BIGINT, allowNull: false, required: true},
})

export default {
    Article,
    New,
    Partner,
    Collection,
    Instruction,
    Email,
    Token
}