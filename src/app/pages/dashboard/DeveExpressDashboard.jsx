import 'devextreme/dist/css/dx.light.css'
import '@devexpress/analytics-core/dist/css/dx-analytics.common.css'
import '@devexpress/analytics-core/dist/css/dx-analytics.light.css'
import '@devexpress/analytics-core/dist/css/dx-querybuilder.css'
import 'devexpress-dashboard/dist/css/dx-dashboard.light.css'
 import {DashboardControl} from 'devexpress-dashboard-react'
import { REPORT_URL } from '../../urls'
const DevexpresExpressDashboard = () => {
    
    return (
        <div style={{width: '100%', height: '80vh'}}>
            {/* http://208.117.44.15/dashboards/dashboardcontrol */}
            {/* https://localhost:5001/dashboardcontrol */}
           
            <DashboardControl
                id='web-dashboard'
                style={{height: '100%'}}
                endpoint='https://app.sipconsult.net/EgolfReportsPool/dashboardcontrol'
                workingMode='ViewerOnly'
                dashboardId='dashboard4'
            ></DashboardControl>
        </div>
    )
}
export default DevexpresExpressDashboard 


