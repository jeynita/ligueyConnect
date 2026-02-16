// // import { DataTypes } from "sequelize";
// // import sequelize from "../config/db.js";

// // const Users = sequelize.define("Users", {
// //   email: {
// //     type: DataTypes.STRING,
// //     allowNull: false,
// //     unique: true
// //   },
// //   password: {
// //     type: DataTypes.STRING,
// //     allowNull: false
// //   }
// // });

// // export default Users;


// import { DataTypes } from "sequelize";
// import sequelize from "../config/db.js";

// const Users = sequelize.define("Users", {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   email: {
//     type: DataTypes.STRING(255),
//     allowNull: false,
//     unique: {
//       msg: "Cet email est déjà utilisé"
//     },
//     validate: {
//       isEmail: {
//         msg: "Format d'email invalide"
//       },
//       notEmpty: {
//         msg: "L'email est requis"
//       }
//     }
//   },
//   password: {
//     type: DataTypes.STRING(255),
//     allowNull: false,
//     validate: {
//       notEmpty: {
//         msg: "Le mot de passe est requis"
//       },
//       len: {
//         args: [60, 255],
//         msg: "Le mot de passe doit être haché (bcrypt)"
//       }
//     }
//   },
//   isActive: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: true
//   },
//   lastLogin: {
//     type: DataTypes.DATE,
//     allowNull: true
//   }
// }, {
//   tableName: "users",
//   timestamps: true,
//   underscored: true,
//   // Exclure le mot de passe par défaut lors des requêtes
//   defaultScope: {
//     attributes: { exclude: ['password'] }
//   },
//   scopes: {
//     withPassword: {
//       attributes: { include: ['password'] }
//     }
//   }
// });

// export default Users;

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Users = sequelize.define("Users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: {
      msg: "Cet email est déjà utilisé"
    },
    validate: {
      isEmail: {
        msg: "Format d'email invalide"
      },
      notEmpty: {
        msg: "L'email est requis"
      }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Le mot de passe est requis"
      },
      len: {
        args: [60, 255],
        msg: "Le mot de passe doit être haché (bcrypt)"
      }
    }
  },
  // ⬇️ NOUVEAU CHAMP : ROLE
  role: {
    type: DataTypes.ENUM('demandeur', 'prestataire', 'recruteur', 'client', 'admin'),
    allowNull: false,
    defaultValue: 'client',
    validate: {
      isIn: {
        args: [['demandeur', 'prestataire', 'recruteur', 'client', 'admin']],
        msg: "Le rôle doit être : demandeur, prestataire, recruteur , client ou admin"
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: "users",
  timestamps: true,
  underscored: true,
  // Exclure le mot de passe par défaut lors des requêtes
  defaultScope: {
    attributes: { exclude: ['password'] }
  },
  scopes: {
    withPassword: {
      attributes: { include: ['password'] }
    }
  }
});

export default Users;