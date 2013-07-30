define([
  "dojo/_base/declare"
  , "modules/Base"
  , "dojo/Deferred"
  , "dojo/has"
  , "sol/promise"
  , "dojo/_base/array"
  , "main/nameTranslator"
  , "main/serverOnly!server/files"
], function(
  declare
  , Base
  , Deferred
  , has
  , solPromise
  , array
  , nameTranslator
  , files
){
  
  return declare([Base], {
    getContent: function(par){
      if (par.contentType != "inode/directory"){
        return;
      };
      var def = new Deferred();
      files.childrenDef(par.fileName).then(function(ar){
        var result = {
          children: []
        };
        solPromise.allDone(array.map(ar, function(child){
          var entry = {
            id: nameTranslator.reduceName(child)
          };
          result.children.push(entry);
          return files.contentTypeDef(child).then(function(contentType){
             entry.contentType = contentType;
          });
        })).then(function(){
          def.resolve(result);
        });
      });
      
      return def;
    }
    
  });
});