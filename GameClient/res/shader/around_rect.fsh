#ifdef GL_ES
    precision lowp float;
#endif

varying vec4 v_fragmentColor;
varying vec2 v_texCoord;

void main()
{
    gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);

    vec2  dir = v_texCoord - vec2(0.5, 0.5);
    float radiu = sqrt(dir.x * dir.x + dir.y * dir.y);

    float r = gl_FragColor[0];
    float g = gl_FragColor[1];
    float b = gl_FragColor[2];
    float a = gl_FragColor[3];

    float flag = r + g + b;
    flag = flag / 3.0;

    //gl_FragColor = vec4(flag,flag,flag,a);

    float _flag_r = 0.46;
    if( radiu > _flag_r )
    {
        float _aflag = radiu - _flag_r;
        _aflag = _aflag / (0.5 - _flag_r);
        _aflag = 1.0 - _aflag;

        gl_FragColor = gl_FragColor * vec4(_aflag,_aflag,_aflag,_aflag);
    }

}