$(function(){
    
    var $addTopic = $('#createTopicBtn');
    var $portfolioSection = $('#portfolio');

    _topic.placeToAppend = $portfolioSection;

    $addTopic.click(function(event){
        event.preventDefault();
        _topic.createTopicForm();
    });

    _topic.getTopics();

        
    console.log()
})





