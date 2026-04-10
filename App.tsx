import { EcoProvider } from "./EcoContext";
import { NotificationsProvider } from "./NotificationsContext";
import { AdProvider } from "./AdContext";

import Home from "./Home";
import Goals from "./Goals";
import LogHabits from "./LogHabits";

import { Route, Switch } from "wouter";

export default function App() {
  return (
    <EcoProvider>
      <NotificationsProvider>
        <AdProvider>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/goals" component={Goals} />
            <Route path="/log" component={LogHabits} />
          </Switch>
        </AdProvider>
      </NotificationsProvider>
    </EcoProvider>
  );
}
