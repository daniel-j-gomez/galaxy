define(["mvc/base/controlled-fetch-collection","mvc/history/hda-model","mvc/history/hdca-model","mvc/history/history-preferences","mvc/base-mvc"],function(a,b,c,d,e){"use strict";var f=a.PaginatedCollection,g=f.extend(e.LoggableMixin).extend({_logNamespace:"history",model:function(a,d){if("dataset"===a.history_content_type)return new b.HistoryDatasetAssociation(a,d);if("dataset_collection"===a.history_content_type){switch(a.collection_type){case"list":return new c.HistoryListDatasetCollection(a,d);case"paired":return new c.HistoryPairDatasetCollection(a,d);case"list:paired":return new c.HistoryListPairedDatasetCollection(a,d)}return{validationError:"Unknown collection_type: "+a.history_content_type}}return{validationError:"Unknown history_content_type: "+a.history_content_type}},limitOnFirstFetch:100,limitPerFetch:50,order:"create_time",initialize:function(a,b){return b=b||{},this.historyId=b.historyId||null,this.model.prototype.idAttribute="type_id",this.includeDeleted=b.includeDeleted||!1,this.includeHidden=b.includeHidden||!1,f.prototype.initialize.call(this,a,b)},urlRoot:Galaxy.root+"api/histories",url:function(){return this.urlRoot+"/"+this.historyId+"/contents"},running:function(){function a(a){return!a.inReadyState()}return new g(this.filter(a))},getByHid:function(a){return _.first(this.filter(function(b){return b.get("hid")===a}))},haveDetails:function(){return this.all(function(a){return a.hasDetails()})},hidden:function(){function a(a){return a.hidden()}return new g(this.filter(a))},deleted:function(){function a(a){return a.get("deleted")}return new g(this.filter(a))},visibleAndUndeleted:function(){function a(a){return a.get("visible")&&!a.get("deleted")}return new g(this.filter(a))},setIncludeDeleted:function(a){_.isBoolean(a)&&a!==this.includeDeleted&&(this.includeDeleted=a,this.trigger("change:include-deleted",a,this))},setIncludeHidden:function(a){_.isBoolean(a)&&a!==this.includeHidden&&(this.includeHidden=a,this.trigger("change:include-hidden",a,this))},fetch:function(a){if(a=a||{},this.historyId&&!a.details){var b=d.HistoryPrefs.get(this.historyId).toJSON();a.details=_.values(b.expandedIds).join(",")}return f.prototype.fetch.call(this,a)},_buildFetchData:function(a){return _.extend(f.prototype._buildFetchData.call(this,a),{v:"dev"})},_fetchParams:f.prototype._fetchParams.concat(["v","details"]),_buildFetchFilters:function(a){var b=f.prototype._buildFetchFilters.call(this,a)||{},c={};return this.includeDeleted||(c.deleted=!1,c.purged=!1),this.includeHidden||(c.visible=!0),_.defaults(b,c)},fetchUpdated:function(a,b){return a&&(b=b||{filters:{}},b.filters={"update_time-ge":a.toISOString(),visible:""}),this.fetch(b).done(function(a){console.log("updated:",a.length,a)})},fetchDeleted:function(a){a=a||{};var b=this;return a.filters=_.extend(a.filters,{deleted:!0,purged:void 0}),b.trigger("fetching-deleted",b),b.fetch(a).always(function(){b.trigger("fetching-deleted-done",b)})},fetchHidden:function(a){a=a||{};var b=this;return a.filters=_.extend(a.filters,{visible:!1}),b.trigger("fetching-hidden",b),b.fetch(a).always(function(){b.trigger("fetching-hidden-done",b)})},fetchAllDetails:function(a){a=a||{};var b={details:"all"};return a.data=_.extend(a.data||{},b),this.fetch(a)},ajaxQueue:function(a,b){var c=jQuery.Deferred(),d=this.length,e=[];if(!d)return c.resolve([]),c;var f=this.chain().reverse().map(function(g,h){return function(){var i=a.call(g,b);i.done(function(a){c.notify({curr:h,total:d,response:a,model:g})}),i.always(function(a){e.push(a),f.length?f.shift()():c.resolve(e)})}}).value();return f.shift()(),c},progressivelyFetchDetails:function(a){function c(a,b){return e.notify(a,g,b),!a.length||a.length<g?(f.allFetched=!0,void e.resolve(a,g,b)):void d(b+g)}function d(b){b=b||0;var d=_.extend(_.clone(a),{view:"summary",keys:i,limit:g,offset:b}),h=0===b?f.fetchFirst:f.fetchMore;_.defer(function(){h.call(f,d).fail(e.reject).done(function(a){c(a,b)})})}a=a||{};var e=jQuery.Deferred(),f=this,g=a.limitPerCall||50,h=b.HistoryDatasetAssociation.prototype.searchAttributes,i=h.join(",");return d(),e},isCopyable:function(a){var b=["HistoryDatasetAssociation","HistoryDatasetCollectionAssociation"];return _.isObject(a)&&a.id&&_.contains(b,a.model_class)},copy:function(a){var b,c,d;_.isString(a)?(b=a,d="hda",c="dataset"):(b=a.id,d={HistoryDatasetAssociation:"hda",LibraryDatasetDatasetAssociation:"ldda",HistoryDatasetCollectionAssociation:"hdca"}[a.model_class]||"hda",c="hdca"===d?"dataset_collection":"dataset");var e=this,f=jQuery.post(this.url(),{content:b,source:d,type:c,view:"detailed",keys:"create_time,update_time"}).done(function(a){e.add([a],{parse:!0})}).fail(function(){e.trigger("error",e,f,{},"Error copying contents",{type:c,id:b,source:d})});return f},createHDCA:function(a,b,d){var e=this,f={list:c.HistoryListDatasetCollection,paired:c.HistoryPairDatasetCollection},g=new f[b]({history_id:this.historyId,name:d,element_identifiers:a});return g.save().done(function(){e.add(g)}).fail(function(a,b,c){e.trigger("error",a,b,c)})},haveSearchDetails:function(){return this.allFetched&&this.all(function(a){return _.has(a.attributes,"annotation")})},matches:function(a){return this.filter(function(b){return b.matches(a)})},clone:function(){var a=Backbone.Collection.prototype.clone.call(this);return a.historyId=this.historyId,a},toString:function(){return["HistoryContents(",[this.historyId,this.length].join(),")"].join("")}});return{HistoryContents:g}});
//# sourceMappingURL=../../../maps/mvc/history/history-contents.js.map