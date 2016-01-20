// The factory for connecting with SQLite database
//
// Advantage of SQLite have no limit ability to store data.
// It will create the sqlite file that store in the application. 
// Also can store more complex data such as relation between tables.
//
// For using sqlite you have to install $cordovaSQLite by running the following 
// command in your cmd.exe for windows or terminal for mac:
// $ cd your_project_path
// $ ionic plugin remove io.litehelpers.cordova.sqlite
// $ ionic plugin add https://github.com/litehelpers/Cordova-sqlite-storage.git
// 
// For install $cordovaSQLite plugin you also have to install this following plugin to get $cordovaSQLite work :
// $ ionic plugin add com.ionic.keyboard
//
// Learn more about $cordovaSQLite :
// http://ngcordova.com/docs/plugins/sqlite/
// 
// The database table of contract will be created in modules.run() method in www/js/app.js file
//
// Variable name db come from initialSQLite() in in www/js/app.js file because we need to initial it before we use.
//
// object schema of contract data is: 
// [{
//     id: id of contract,
//     firstName: first name,
//     lastName: last name,
//     telephone: telephone
//     email: email,
//     createDate: contract created date,
//     age: age,
//     isEnable: to enable and unable status of contract
// }]

//ContractDB service
appServices.factory('ContractDB', function ($cordovaSQLite)
{    
   // contractList variable use to store data from sqlite query
   var contractList = []; 

    return {
        // Select all data from sqlite
        all: function ()
        {
            contractList = [];

            // Variable for prepare query statement to select all contracts.
            var query = "SELECT * FROM contracts";

            // Execute query statement from query variable.
            $cordovaSQLite.execute(db, query).then(function (res)
            {
                if (res.rows.length > 0)
                {
                    for (var i = 0; i < res.rows.length; i++)
                    {
                        var dataItem = {
                            id          : res.rows.item(i).id           ,
                            firstName   : res.rows.item(i).firstName    ,
                            lastName    : res.rows.item(i).lastName     ,
                            telephone   : res.rows.item(i).telephone    ,
                            email       : res.rows.item(i).email        ,
                            createDate  : res.rows.item(i).createDate   ,
                            age         : res.rows.item(i).age          ,
                            isEnable    : (res.rows.item(i).isEnable == "true")
                        };
                        contractList.push(dataItem);
                    }
                }
            });
            return contractList;
        },// End select all data.

        // To add data to sqlite.
        // It will receive newContract from controller then insert it into sqlite.
        add: function (newContract)
        {
           
            // Variable for prepare query statement to insert contracts.
            var query = "INSERT INTO contracts (       "    +
                        "  firstName      ,            "    +
                        "  lastName       ,            "    +
                        "  telephone      ,            "    +
                        "  email          ,            "    +
                        "  createDate     ,            "    +
                        "  age            ,            "    +
                        "  isEnable)                   "    +
                        "  VALUES (?,?,?,?,?,?,?)      ";
           // Execute query statement from query variable.
            $cordovaSQLite.execute(db, query,
                [newContract.firstName          ,
                    newContract.lastName        ,
                    newContract.telephone       ,
                    newContract.email           ,
                    newContract.createDate      ,
                    parseInt(newContract.age)   ,
                    newContract.isEnable        ,
                ]).then(function (res)
                {
                    var dataItem = {
                        id          : res.insertId              ,
                        firstName   : newContract.firstName     ,
                        lastName    : newContract.lastName      ,
                        telephone   : newContract.telephone     ,
                        email       : newContract.email         ,
                        createDate  : newContract.createDate    ,
                        age         : newContract.age           ,
                        isEnable    : newContract.isEnable
                    };
                    contractList.push(dataItem);
                });
        },// End add data to sqlite.

        // To update data to sqlite.
        // It will receive contract from controller then update it into sqlite.
        update: function (contract)
        {
            // Variable for prepare query statement to update contracts by contracts id.
            var query = "UPDATE contracts SET " +
                        "  firstName     = (?) ,    "   +
                        "  lastName      = (?) ,    "   +
                        "  telephone     = (?) ,    "   +
                        "  email         = (?) ,    "   +
                        "  age           = (?) ,    "   +
                        "  isEnable      = (?)      "   +
                        "  WHERE id      = (?)      "   ;

            // Execute query statement from query variable.
            $cordovaSQLite.execute(db, query, [
                        contract.firstName          ,
                        contract.lastName           ,
                        contract.telephone          , 
                        contract.email              ,
                        parseInt(contract.age)      ,
                        contract.isEnable           ,
                        contract.id]
                ).then(function (result)
                {
                    for (var i = 0; i < contractList.length; i++)
                    {
                        if (contractList[i].id === parseInt(contract.id))
                        {
                            contractList[i] = contract;
                        }
                    }
                })
        },// End update data to sqlite.

        // To remove data from sqlite.
        // It will receive contract from controller then use contract.id to remove contract from sqlite.
        remove: function (contract)
        {
            // Variable for prepare query statement to remove contracts by contracts id.
            var query = "DELETE FROM contracts WHERE id = (?)";

            // Execute query statement from query variable.
            $cordovaSQLite.execute(db, query, [contract.id]).then(function (result)
            {
                contractList.splice(contractList.indexOf(contract), 1);
            })
        },// End remove data from sqlite.

        // To remove all data from sqlite.
        removeAll: function ()
        {
            // Variable for prepare query statement to remove all contracts.
            var query = "DELETE FROM contracts";

            // Execute query statement from query variable.
            $cordovaSQLite.execute(db, query).then(function (result)
            {
                contractList.length = 0;
            })
        },// End remove all data from sqlite.
    };
}); //End ContractDB service.