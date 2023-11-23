import { HashRouter, Routes, Route } from 'react-router-dom';
import { Controls, Peripleo } from '@peripleo/peripleo';
import { Map, Zoom } from '@peripleo/peripleo/maplibre';
import { AppHeader, TypeSenseSearch } from './components';
import { Search, SiteDetails } from './pages';

import '@peripleo/peripleo/default-theme';

export const App = () => {

  return (
    <Peripleo>
      <TypeSenseSearch>
        <AppHeader />

        <HashRouter>
          <Routes>
            <Route path="/">
              <Route index element={<Search />} />
              <Route path="site/:site" element={<SiteDetails />} />
            </Route>
          </Routes>
        </HashRouter>

        <Map>
          <Controls position="topright">
            <Zoom />
          </Controls>
        </Map>
      </TypeSenseSearch>
    </Peripleo>
  )

}