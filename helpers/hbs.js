const moment = require('moment');
module.exports = {
    truncate: function(str, len){
        if(str.length > len && str.length > 0){
            var new_str = str + " ";
            new_str = str.substr(0, len);
            new_str = str.substr(0, new_str.lastIndexOf(" "));
            new_str = (new_str.length > 0) ? new_str: str.substr(0, len);
            return new_str + '...';
        }
        return str;
    },
    stripTags: function(input){
        return input.replace(/<(?:.|\n)*?>/gm, '');
    },
    formatDate: function(date, type){
        return moment(date).format(type);
    },
    selected: function(selected, options){
        return options.fn(this).replace(new RegExp(' value=\"'+ selected + '\"'), '$& selected="selected"')
        .replace(new RegExp('>' + selected + '</option>'), 'selected="selected"$&');
    },
    editIcon: function(storyUser, loggedUser, storyId, floating= true){
        if(storyUser === loggedUser){
            if(floating){
                return `<a href="story/edit/${storyId}" class="btn-floating red halfway-fab"><i class="fa fa-pencil"></i></a>`
            }else{
                return `<a href="story/edit/${storyId}"><i class="fa fa-pencil"></i></a>`
            }
        }else{
            return ; 
        }
    }
}