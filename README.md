# Planning Poker App

## Description

This is a real-time application designed to facilitate remote "Planning Poker" sessions for Agile development teams. The app allows users to submit their estimates for user stories and features, and then see their teammates' estimates after all have been submitted.

## Key Features

- User registration
- Real-time updating of users' estimates
- Ability to show or hide estimates

## Possible Features

- [ ] Hovering over a points card gives an explanation or description about how much work that specific card is worth.

- [ ] Ability for any connected user to add a link to the user story being discussed (from TFS) for self-reading.

  - [ ] After each story, implement a "New Story" button to point to the next story, prompting the user for a TFS link.
  - [ ] Save data for the previous story when "New Story" button is clicked.
  - [ ] Users can download session data for each discussed story when the session is over with a "Download CSV" button.

- [ ] Edit display name.

- [ ] Ability to select name from a dropdown, making the app team-specific. This will make the `Edit name` functionality obsolete.

- [ ] Implement a pie chart to display average, median, mode, low, and high estimates.

  - [ ] Add functionality to hover over the pie chart and show which users selected which value.
  - [ ] The pie chart should have some Chakra transition such as [slide fade](https://chakra-ui.com/docs/components/transitions/usage) when values are revealed.
  - [ ] Use [Chart.js](https://www.chartjs.org/docs/latest/samples/other-charts/pie.html) for this feature.

- [ ] Show user selection history for a specific user story.

## Setup and Installation

### Prerequisites

To run this application, you'll need:

- Node.js and npm installed on your local machine. You can download them [here](https://nodejs.org/en/download/).

### Installation Steps

1. Clone this repository

```bash
git clone https://github.com/AdamAlam/PlanningPoker
```

2. Install frontend dependencies

```bash
cd frontend && npm i
```

3. Install backend dependencies

```bash
cd ../backend && npm i
```

### Running the Application

1. Start the backend server

```bash
cd backend && npm run dev
```

2. In a new terminal window, start the frontend application

```bash
cd frontend && npm run dev
```

Now the application should be running at `http://localhost:5173` (or your specified port)

### Technology Stack

This application uses the following technologies:

- Frontend: React.js with Chakra UI for component styling
- Backend: Express.js with socket.io for real-time communication

### Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

### License

#### [MIT](https://choosealicense.com/licenses/mit/)
