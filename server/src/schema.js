const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList } = require('graphql');
const User = require('../models/User');
const Pet = require('../models/Pet');
const authMiddleware = require('./authMiddleware');

// Tipo de usuário no GraphQL
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        petPreference: { type: GraphQLList(GraphQLString) }
    })
});

// Tipo de pet no GraphQL
const PetType = new GraphQLObjectType({
    name: 'Pet',
    fields: () => ({
        name: { type: GraphQLString },
        type: { type: GraphQLString },
        description: { type: GraphQLString },
        idealConditions: { type: GraphQLList(GraphQLString) }
    })
});

// Query protegida para retornar pets recomendados
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        me: {
            type: UserType,
            resolve(parent, args, context) {
                const decodedUser = authMiddleware(context.req);
                return User.findById(decodedUser.id);
            }
        },

        recommendedPets: {
            type: new GraphQLList(PetType),
            async resolve(parent, args, context) {
                const decodedUser = authMiddleware(context.req);
                const user = await User.findById(decodedUser.id);

                if (!user) {
                    throw new Error('User not found');
                }

                // Buscar pets baseados nas preferências do usuário
                return Pet.find({
                    type: { $in: user.petPreference }, // Ex.: ['Dog', 'Cat']
                    idealConditions: { $in: ["Apartment", "Kids-friendly"] }
                });
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});
