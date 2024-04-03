import React, { useState } from 'react';
import './HomePage.css';
import SearchBar from 'material-ui-search-bar';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const cardDetails = [
    {
      imageSrc: '/images/quic.jpg',
      title: 'Quick Quiz Generator',
      text: 'Rapidly Create Engaging Quizzes',
      link: '/quick-quizz',
      isActive: true,
    },
    {
      imageSrc: '/images/assess.jpg',
      title: 'Assessment Creator',
      text: 'Create Custom Assessments',
      link: '/assessment-creator',
      isActive: true,
    },
    {
      imageSrc: '/images/case.jpg',
      title: 'Case Study Creator',
      text: 'Craft Engaging Case Studies',
      link: '/case-study-creator',
      isActive: true,
    },
    {
      imageSrc: '/images/image.jpg',
      title: 'Snap Scriptor',
      text: 'Transform Visuals To Text',
      link: '/image-translate',
      isActive: true,
    },
    {
      imageSrc: '/images/promptt.jpg',
      title: 'Prompt Enhancer',
      text: 'Tune Your AI Prompt',
      link: '/prompt-enhancer',
      isActive: false,
    },
    {
      imageSrc: '/images/codee.jpg',
      title: 'Code Reviewer',
      text: 'Evaluate Code Effectively',
      link: '/code-reviewer',
      isActive: false,
    },
    {
      imageSrc: '/images/mock.jpg',
      title: 'Mock Interviewer',
      text: 'Prepare For Success',
      link: '/mock-interview',
      isActive: false,
    },
    {
      imageSrc: '/images/codegen.jpg',
      title: 'Code Generator',
      text: 'Enhancing Workflow Efficiency',
      link: '/code-generator',
      isActive: false,
    },
    {
      imageSrc: '/images/blogg.jpg',
      title: 'BlogCrafter',
      text: 'Generate Blog Posts',
      link: '/blog-generator',
      isActive: true,
    },
    {
      imageSrc: '/images/role-playy.png',
      imageSrc: '/images/role.jpg',
      title: 'Role Play Generator (RPG)  ',
      text: 'Generate Role Play Activities',
      link: '/role-play',
      isActive: true,
    },
  ];

  const filteredCards = cardDetails.filter(card => card.title.toLowerCase().includes(searchTerm.toLowerCase()));

  // Sort filteredCards so that active cards come first
  filteredCards.sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1));

  return (
    <div className="home-page">
      <div className="search-bar">
        <SearchBar type="text" value={searchTerm} onChange={newValue => setSearchTerm(newValue)} />
      </div>
      <div className="card-container">
        {filteredCards.map((card, index) => (
          <div
            className={`card-home card-hover ${card.isActive ? 'card-hover' : ''}  ${!card.isActive ? 'card-disabled' : ''}`}
            style={{ width: '100%' }}
            key={index}
          >
            <img src={card.imageSrc} className="card-img-top" alt="Card" />
            <div className="card-body">
              <h5 className="card-title">{card.title}</h5>
              <p className="card-text">{card.text}</p>
              <div class="custom-btn-container">
                <a
                  href={card.link}
                  className={`btn btn-primary custom-btn ${!card.isActive ? 'disabled-link' : ''}`}
                  style={!card.isActive ? { pointerEvents: 'none' } : {}}
                >
                  Start
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
