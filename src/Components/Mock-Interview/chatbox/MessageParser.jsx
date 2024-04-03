import React from 'react';

const MessageParser = ({ children, actions }) => {
    // console.log(children.props.state)
    const { checker } = children.props.state;
    const parse = (message) => {


      

      
      


      if (checker === "domain") {
        children.props.state.userData.domain = message;
        actions.afterInitialMessage(children.props.state.userData.domain);
        
        
        console.log(children.props.state.userData.domain);
      
        
    }

        if (checker === "role") {
          children.props.state.userData.role = message;
            actions.afterDomainMessage(children.props.state.userData.role);
            
            console.log(children.props.state.userData.role);
            
        }

        if (checker === "specific_topic" ) {
          children.props.state.userData.specific_topic = message;
            actions.afterRoleMessage(children.props.state.userData.specific_topic);
            
            console.log(children.props.state.userData.specific_topic);
            console.log(checker)
        }
        

        if (checker === "difficulty_level") {
          
          
        console.log(checker)
          
          children.props.state.userData.difficulty_level = message;
          
          actions.finalResult(
            children.props.state.userData.domain,
            children.props.state.userData.role,
            children.props.state.userData.specific_topic,
            children.props.state.userData.difficulty_level,
          
        );

        console.log(children.props.state.userData)
        
          
      }
     
      if (checker === "questions" ) {
        console.log(checker)
        actions.fetchData();
        
        
    }
    }
    return (
        <div>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child, {
                    parse: parse,
                    actions,
                });
            })}
        </div>
    );
};

export default MessageParser;