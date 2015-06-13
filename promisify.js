
module.exports = function(thisObj, callable) {
  var args = Array.prototype.slice.call(arguments);
  var promise = new Promise(function(resolve, reject){
    args.push(function(err, result){
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
    var func = thisObj[callable].apply(thisObj, args.slice(2));
  });

  return promise;
};
