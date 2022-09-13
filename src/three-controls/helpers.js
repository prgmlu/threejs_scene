export const ApproxAtan = (z)=>
{
    const n1 = 0.97239411;
    const n2 = -0.19194795;
    return (n1 + n2 * z * z) * z;
}


export const ApproxAtan2 = ( y,  x) =>
{
    if (x != 0.0)
    {
        if (Math.abs(x) > Math.abs(y))
        {
            const  z = y / x;
            if (x > 0.0)
            {
                // atan2(y,x) = atan(y/x) if x > 0
                return ApproxAtan(z);
            }
            else if (y >= 0.0)
            {
                // atan2(y,x) = atan(y/x) + PI if x < 0, y >= 0
                return ApproxAtan(z) + Math.PI;
            }
            else
            {
                // atan2(y,x) = atan(y/x) - Math.PI if x < 0, y < 0
                return ApproxAtan(z) - Math.PI;
            }
        }
        else // Use property atan(y/x) = Math.PI/2 - atan(x/y) if |y/x| > 1.
        {
            const  z = x / y;
            if (y > 0.0)
            {
                // atan2(y,x) = PI/2 - atan(x/y) if |y/x| > 1, y > 0
                return -ApproxAtan(z) + Math.PI/2;
            }
            else
            {
                // atan2(y,x) = -PI/2 - atan(x/y) if |y/x| > 1, y < 0
                return -ApproxAtan(z) - Math.PI/2;
            }
        }
    }
    else
    {
        if (y > 0.0) // x = 0, y > 0
        {
            return Math.PI/2;
        }
        else if (y < 0.0) // x = 0, y < 0
        {
            return -Math.PI/2;
        }
    }
    return 0.0; // x,y = 0. Could return NaN instead.
}

